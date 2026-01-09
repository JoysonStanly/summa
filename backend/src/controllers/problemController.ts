import { Request, Response } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { AuthRequest } from '../types';
import Problem from '../models/Problem';
import Editorial from '../models/Editorial';
import TestCase from '../models/TestCase';
import StarterCode from '../models/StarterCode';
import { loadProblemJSON, filterTestCases } from '../utils/jsonLoader';

/**
 * @desc    Get all problems with optional filters
 * @route   GET /api/v1/problems
 * @access  Public
 */
export const getProblems = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { difficulty, category, tags } = req.query;

    // Build query based on filters
    const query: any = {};
    
    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;
    if (tags) query.tags = { $in: (tags as string).split(',') };

    // Only fetch metadata (no content from JSON files for list view)
    const problems = await Problem.find(query)
      .select('-__v -contentPath') // Don't expose internal file paths
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: problems.length,
      data: problems,
    });
  } catch (error: any) {
    console.error('Get problems error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching problems',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single problem by ID or slug
 * @route   GET /api/v1/problems/:id
 * @access  Public
 */
export const getProblem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let problem;

    // Check if id is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      problem = await Problem.findById(id);
    } else {
      // Try to find by slug
      problem = await Problem.findOne({ slug: id });
    }

    if (!problem) {
      res.status(404).json({
        success: false,
        message: 'Problem not found',
      });
      return;
    }

    // Load JSON content
    let jsonContent;
    try {
      jsonContent = loadProblemJSON(problem.contentPath);
    } catch (error: any) {
      // Backward/forward compatibility:
      // - Older records used: backend/data/problems/{slug}.json
      // - New structure uses: data/DSA/{category}/{subcategory}/{slug}.json
      const fallbackPath = `data/DSA/${problem.category}/${problem.subcategory}/${problem.slug}.json`;
      try {
        jsonContent = loadProblemJSON(fallbackPath);
        // Heal DB for next time (best-effort)
        await Problem.updateOne({ _id: problem._id }, { $set: { contentPath: fallbackPath } });
      } catch (fallbackError: any) {
        console.error('JSON load error:', error);
        console.error('JSON fallback load error:', fallbackError);
        res.status(500).json({
          success: false,
          message: 'Problem content not available',
          error: req.user?.role === 'admin' ? fallbackError.message : undefined,
        });
        return;
      }
    }

    // Filter hidden test cases for non-admin users
    const isAdmin = req.user?.role === 'admin';
    const filteredTestCases = filterTestCases(jsonContent.testCases, isAdmin);

    // Get editorial metadata from MongoDB (optional)
    const editorial = await Editorial.findOne({ problemId: problem._id });

    // Merge MongoDB metadata with JSON content
    const responseData = {
      // MongoDB metadata
      _id: problem._id,
      title: problem.title,
      slug: problem.slug,
      difficulty: problem.difficulty,
      category: problem.category,
      tags: problem.tags,
      submissionCount: problem.submissionCount,
      acceptanceRate: problem.acceptanceRate,
      createdAt: problem.createdAt,
      updatedAt: problem.updatedAt,

      // JSON content
      statement: jsonContent.problem.statement,
      examples: jsonContent.problem.examples,
      constraints: jsonContent.problem.constraints,
      hints: jsonContent.problem.hints,
      testCases: filteredTestCases,
      starterCode: jsonContent.starterCode,

      // Editorial from JSON (always include if exists)
      editorial: jsonContent.editorial ? {
        sections: jsonContent.editorial.sections,
        solutions: jsonContent.editorial.solutions,
        dryRunImages: jsonContent.editorial.dryRunImages,
        videoUrl: jsonContent.editorial.videoUrl || editorial?.videoUrl,
        hasVideo: !!jsonContent.editorial.videoUrl || editorial?.hasVideo || false,
      } : null,
    };

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error: any) {
    console.error('Get problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching problem',
      error: error.message,
    });
  }
};

/**
 * @desc    Create new problem (metadata only)
 * @route   POST /api/v1/problems
 * @access  Private (Admin only)
 * @note    Creates problem in MongoDB with isDraft=true. Admin must manually create JSON file before publishing.
 */
export const createProblem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { editorialMeta, testCaseMeta, starterCodeMeta, ...problemData } = req.body;

    // Set default values for new problems
    const problemDefaults = {
      submissionCount: 0,
      acceptanceRate: 0,
    };

    // Generate contentPath from slug (will be auto-generated in pre-save hook)
    const slug = problemData.slug || problemData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Prefer admin-provided contentPath, otherwise default to new DSA structure.
    const defaultContentPath = `data/DSA/${String(problemData.category || '').trim()}/${String(problemData.subcategory || '').trim()}/${slug}.json`;
    const rawContentPath = typeof (problemData as any).contentPath === 'string' ? String((problemData as any).contentPath).trim() : '';
    let contentPath = rawContentPath || defaultContentPath;

    // Normalize and validate (avoid accidental "backend/" prefix and path traversal)
    contentPath = contentPath.replace(/\\/g, '/');
    if (contentPath.startsWith('backend/')) contentPath = contentPath.slice('backend/'.length);
    if (contentPath.startsWith('./')) contentPath = contentPath.slice(2);

    if (path.isAbsolute(contentPath) || contentPath.includes('..')) {
      res.status(400).json({
        success: false,
        message: 'Invalid contentPath. Use a relative path like data/DSA/Topic/subtopic/slug.json',
      });
      return;
    }

    // Create problem with metadata only
    const problem = await Problem.create({
      ...problemDefaults,
      ...problemData,
      contentPath,
    });

    const createdData: any = { problem };

    // Create editorial metadata if provided
    if (editorialMeta) {
      const editorialDoc = await Editorial.create({
        problemId: problem._id,
        hasEditorial: editorialMeta.hasEditorial ?? false,
        hasVideo: editorialMeta.hasVideo ?? false,
        videoUrl: editorialMeta.videoUrl,
        videoProvider: editorialMeta.videoProvider,
        videoDuration: editorialMeta.videoDuration,
        version: 1,
        lastModified: new Date(),
      });
      createdData.editorial = editorialDoc;
    }

    // Create test case metadata if provided
    if (testCaseMeta && Array.isArray(testCaseMeta)) {
      const testCasePromises = testCaseMeta.map((tc: any, index: number) =>
        TestCase.create({
          problemId: problem._id,
          testCaseNumber: tc.testCaseNumber ?? index + 1,
          isHidden: tc.isHidden ?? false,
          isEnabled: tc.isEnabled ?? true,
          weight: tc.weight ?? 10,
          order: tc.order ?? index,
        })
      );
      createdData.testCases = await Promise.all(testCasePromises);
    }

    // Create starter code metadata if provided
    if (starterCodeMeta) {
      const starterCodeDoc = await StarterCode.create({
        problemId: problem._id,
        availableLanguages: starterCodeMeta.availableLanguages ?? ['javascript', 'python'],
        defaultLanguage: starterCodeMeta.defaultLanguage ?? 'javascript',
        version: 1,
        lastModified: new Date(),
      });
      createdData.starterCode = starterCodeDoc;
    }

    res.status(201).json({
      success: true,
      message: 'Problem metadata created successfully. Please create the JSON file manually before publishing.',
      data: createdData,
      instructions: {
        nextSteps: [
          `Create JSON file at: ${contentPath}`,
          'Use two-sum.json as template',
          'Add problem statement, examples, constraints, hints',
          'Add editorial content, solutions, test cases, starter code',
          'Commit JSON file to Git',
          'Use PATCH /api/v1/problems/:id/publish to publish',
        ],
      },
    });
  } catch (error: any) {
    console.error('Create problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating problem',
      error: error.message,
    });
  }
};

/**
 * @desc    Update problem metadata
 * @route   PUT /api/v1/problems/:id
 * @access  Private (Admin only)
 * @note    Only updates MongoDB metadata. To update content, edit JSON file manually.
 */
export const updateProblem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { editorialMeta, testCaseMeta, starterCodeMeta, ...problemData } = req.body;

    // Prevent updating content fields (these are in JSON)
    const allowedFields = [
      'title', 'difficulty', 'category', 'tags',
      'submissionCount', 'acceptanceRate',
    ];

    const updateData: any = {};
    for (const field of allowedFields) {
      if (problemData[field] !== undefined) {
        updateData[field] = problemData[field];
      }
    }

    // Update slug if title changed
    if (updateData.title) {
      updateData.slug = updateData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      updateData.contentPath = `backend/data/problems/${updateData.slug}.json`;
    }

    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!problem) {
      res.status(404).json({
        success: false,
        message: 'Problem not found',
      });
      return;
    }

    const updatedData: any = { problem };

    // Update editorial metadata if provided
    if (editorialMeta) {
      const editorialDoc = await Editorial.findOneAndUpdate(
        { problemId: problem._id },
        {
          hasEditorial: editorialMeta.hasEditorial,
          hasVideo: editorialMeta.hasVideo,
          videoUrl: editorialMeta.videoUrl,
          videoProvider: editorialMeta.videoProvider,
          videoDuration: editorialMeta.videoDuration,
          version: editorialMeta.version,
          lastModified: new Date(),
        },
        { new: true, upsert: true, runValidators: true }
      );
      updatedData.editorial = editorialDoc;
    }

    // Update test case metadata if provided
    if (testCaseMeta && Array.isArray(testCaseMeta)) {
      // Delete existing metadata
      await TestCase.deleteMany({ problemId: problem._id });
      
      // Create new metadata
      const testCasePromises = testCaseMeta.map((tc: any, index: number) =>
        TestCase.create({
          problemId: problem._id,
          testCaseNumber: tc.testCaseNumber ?? index + 1,
          isHidden: tc.isHidden ?? false,
          isEnabled: tc.isEnabled ?? true,
          weight: tc.weight ?? 10,
          order: tc.order ?? index,
        })
      );
      updatedData.testCases = await Promise.all(testCasePromises);
    }

    // Update starter code metadata if provided
    if (starterCodeMeta) {
      const starterCodeDoc = await StarterCode.findOneAndUpdate(
        { problemId: problem._id },
        {
          availableLanguages: starterCodeMeta.availableLanguages,
          defaultLanguage: starterCodeMeta.defaultLanguage,
          version: starterCodeMeta.version,
          lastModified: new Date(),
        },
        { new: true, upsert: true, runValidators: true }
      );
      updatedData.starterCode = starterCodeDoc;
    }

    res.status(200).json({
      success: true,
      message: 'Problem metadata updated successfully',
      data: updatedData,
      note: 'To update problem content (statement, examples, etc.), edit the JSON file manually',
    });
  } catch (error: any) {
    console.error('Update problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating problem',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete problem (soft delete by default)
 * @route   DELETE /api/v1/problems/:id
 * @access  Private (Admin only)
 * @note    Soft deletes by default (sets isDeleted=true). Use ?hard=true for hard delete.
 */
export const deleteProblem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { hard } = req.query;
    const problemId = req.params.id;

    // Try to find by slug first, then by ObjectId
    let problem = await Problem.findOne({ slug: problemId });
    
    if (!problem) {
      // Check if it's a valid ObjectId and try to find by _id
      const mongoose = require('mongoose');
      if (mongoose.Types.ObjectId.isValid(problemId)) {
        problem = await Problem.findById(problemId);
      }
    }

    if (!problem) {
      res.status(404).json({
        success: false,
        message: 'Problem not found',
      });
      return;
    }

    // Hard delete (dangerous - rarely used)
    if (hard === 'true') {
      await Problem.findByIdAndDelete(problem._id);

      // Delete all related metadata (cascade delete)
      await Promise.all([
        Editorial.deleteOne({ problemId: problem._id }),
        TestCase.deleteMany({ problemId: problem._id }),
        StarterCode.deleteOne({ problemId: problem._id }),
      ]);

      res.status(200).json({
        success: true,
        message: 'Problem hard deleted successfully',
        warning: 'JSON file preserved in Git. Delete manually if needed.',
        data: {
          deletedProblem: {
            id: problem._id,
            title: problem.title,
            slug: problem.slug,
            contentPath: problem.contentPath,
          },
        },
      });
      return;
    }

    // Default: Just delete from database
    await Problem.findByIdAndDelete(problem._id);
    await Promise.all([
      Editorial.deleteOne({ problemId: problem._id }),
      TestCase.deleteMany({ problemId: problem._id }),
      StarterCode.deleteOne({ problemId: problem._id }),
    ]);

    res.status(200).json({
      success: true,
      message: 'Problem deleted successfully',
      data: {
        deletedId: problem._id,
      },
    });
  } catch (error: any) {
    console.error('Delete problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting problem',
      error: error.message,
    });
  }
};

/**
 * @desc    Get problem editorial
 * @route   GET /api/v1/problems/:id/editorial
 * @access  Public
 */
export const getProblemEditorial = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let problem;

    // Check if id is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      problem = await Problem.findById(id);
    } else {
      // Try to find by slug
      problem = await Problem.findOne({ slug: id });
    }

    if (!problem) {
      res.status(404).json({
        success: false,
        message: 'Problem not found',
      });
      return;
    }

    // Get editorial metadata
    const editorialMeta = await Editorial.findOne({ problemId: problem._id });

    if (!editorialMeta || !editorialMeta.hasEditorial) {
      res.status(404).json({
        success: false,
        message: 'Editorial not available for this problem',
      });
      return;
    }

    // Load JSON content
    const jsonContent = loadProblemJSON(problem.contentPath);

    // Merge metadata with content
    const editorialData = {
      sections: jsonContent.editorial.sections,
      solutions: jsonContent.editorial.solutions,
      dryRunImages: jsonContent.editorial.dryRunImages,
      videoUrl: editorialMeta.videoUrl,
      hasVideo: editorialMeta.hasVideo,
      version: editorialMeta.version,
    };

    res.status(200).json({
      success: true,
      data: editorialData,
    });
  } catch (error: any) {
    console.error('Get editorial error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching editorial',
      error: error.message,
    });
  }
};

/**
 * @desc    Get problem test cases
 * @route   GET /api/v1/problems/:id/testcases
 * @access  Public (hidden ones for admin only)
 */
export const getProblemTestCases = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let problem;

    // Check if id is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      problem = await Problem.findById(id);
    } else {
      // Try to find by slug
      problem = await Problem.findOne({ slug: id });
    }

    if (!problem) {
      res.status(404).json({
        success: false,
        message: 'Problem not found',
      });
      return;
    }

    // Load JSON content
    const jsonContent = loadProblemJSON(problem.contentPath);

    // Filter hidden test cases for non-admin users
    const isAdmin = req.user?.role === 'admin';
    const filteredTestCases = filterTestCases(jsonContent.testCases, isAdmin);

    res.status(200).json({
      success: true,
      count: filteredTestCases.length,
      data: filteredTestCases,
    });
  } catch (error: any) {
    console.error('Get test cases error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching test cases',
      error: error.message,
    });
  }
};

/**
 * @desc    Get problem starter code
 * @route   GET /api/v1/problems/:id/startercode
 * @access  Public
 */
export const getProblemStarterCode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let problem;

    // Check if id is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      problem = await Problem.findById(id);
    } else {
      // Try to find by slug
      problem = await Problem.findOne({ slug: id });
    }

    if (!problem) {
      res.status(404).json({
        success: false,
        message: 'Problem not found',
      });
      return;
    }

    // Load JSON content
    const jsonContent = loadProblemJSON(problem.contentPath);

    res.status(200).json({
      success: true,
      data: jsonContent.starterCode,
    });
  } catch (error: any) {
    console.error('Get starter code error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching starter code',
      error: error.message,
    });
  }
};

/**
 * @desc    Like a problem
 * @route   POST /api/v1/problems/:id/like
 * @access  Public
 */
export const likeProblem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find problem by ID or slug
    const problem = await Problem.findOne({
      $or: [{ _id: id }, { slug: id }],
    });

    if (!problem) {
      res.status(404).json({
        success: false,
        message: 'Problem not found',
      });
      return;
    }

    // Increment likes
    problem.likes = (problem.likes || 0) + 1;
    await problem.save();

    res.status(200).json({
      success: true,
      data: {
        likes: problem.likes,
        dislikes: problem.dislikes,
      },
    });
  } catch (error: any) {
    console.error('Like problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking problem',
      error: error.message,
    });
  }
};

/**
 * @desc    Dislike a problem
 * @route   POST /api/v1/problems/:id/dislike
 * @access  Public
 */
export const dislikeProblem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find problem by ID or slug
    const problem = await Problem.findOne({
      $or: [{ _id: id }, { slug: id }],
    });

    if (!problem) {
      res.status(404).json({
        success: false,
        message: 'Problem not found',
      });
      return;
    }

    // Increment dislikes
    problem.dislikes = (problem.dislikes || 0) + 1;
    await problem.save();

    res.status(200).json({
      success: true,
      data: {
        likes: problem.likes,
        dislikes: problem.dislikes,
      },
    });
  } catch (error: any) {
    console.error('Dislike problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Error disliking problem',
      error: error.message,
    });
  }
};

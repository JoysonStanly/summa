import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../types';
import Problem from '../models/Problem';
import { exportProblemToFile, deleteProblemFromFile } from '../utils/problemExporter';

/**
 * @desc    Get all problems with optional filters
 * @route   GET /api/v1/problems
 * @access  Public
 */
export const getProblems = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { difficulty, category, tags } = req.query;

    // Build query
    const query: any = {};
    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;
    if (tags) query.tags = { $in: (tags as string).split(',') };

    const problems = await Problem.find(query)
      .select('-testCases') // Hide test cases from list view
      .sort({ createdAt: -1 });

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

    // Hide hidden test cases from non-admin users
    if (req.user?.role !== 'admin') {
      problem.testCases = problem.testCases.filter((tc) => !tc.hidden);
    }

    res.status(200).json({
      success: true,
      data: problem,
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
 * @desc    Create new problem
 * @route   POST /api/v1/problems
 * @access  Private (Admin only)
 */
export const createProblem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const problem = await Problem.create(req.body);

    // 🔥 Auto-export problem to JSON file for GitHub storage
    try {
      await exportProblemToFile(problem);
    } catch (exportError) {
      console.error('Failed to export problem to file:', exportError);
      // Continue even if export fails
    }

    res.status(201).json({
      success: true,
      message: 'Problem created successfully',
      data: problem,
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
 * @desc    Update problem
 * @route   PUT /api/v1/problems/:id
 * @access  Private (Admin only)
 */
export const updateProblem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
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

    // 🔥 Auto-export updated problem to JSON file
    try {
      await exportProblemToFile(problem);
    } catch (exportError) {
      console.error('Failed to export updated problem to file:', exportError);
      // Continue even if export fails
    }

    res.status(200).json({
      success: true,
      message: 'Problem updated successfully',
      data: problem,
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
 * @desc    Delete problem
 * @route   DELETE /api/v1/problems/:id
 * @access  Private (Admin only)
 */
export const deleteProblem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);

    if (!problem) {
      res.status(404).json({
        success: false,
        message: 'Problem not found',
      });
      return;
    }

    // 🔥 Auto-delete problem from JSON file
    try {
      await deleteProblemFromFile(problem.slug, problem.category);
    } catch (exportError) {
      console.error('Failed to delete problem from file:', exportError);
      // Continue even if delete fails
    }

    res.status(200).json({
      success: true,
      message: 'Problem deleted successfully',
      data: {},
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

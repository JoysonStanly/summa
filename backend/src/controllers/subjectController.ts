import { Request, Response } from 'express';
import { Subject, Module, Topic } from '../models/Subject';
import githubService from '../services/githubService';

// @desc    Get all subjects
// @route   GET /api/v1/subjects
// @access  Public
export const getSubjects = async (_req: Request, res: Response): Promise<void> => {
  try {
    const subjects = await Subject.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subjects',
      error: error.message,
    });
  }
};

// @desc    Get single subject with content
// @route   GET /api/v1/subjects/:id
// @access  Public
export const getSubject = async (req: Request, res: Response): Promise<void> => {
  try {
    const subject = await Subject.findById(req.params.id).populate('modules');

    if (!subject) {
      res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
      return;
    }

    // Fetch content from GitHub
    let content = null;
    try {
      content = await githubService.fetchSubjectContent(subject.githubPath);
    } catch (error: any) {
      console.error('Failed to fetch content from GitHub:', error.message);
    }

    res.status(200).json({
      success: true,
      data: {
        ...subject.toObject(),
        content,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subject',
      error: error.message,
    });
  }
};

// @desc    Get modules by subject
// @route   GET /api/v1/subjects/:subjectId/modules
// @access  Public
export const getModulesBySubject = async (req: Request, res: Response) => {
  try {
    const modules = await Module.find({
      subjectId: req.params.subjectId,
    }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: modules.length,
      data: modules,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch modules',
      error: error.message,
    });
  }
};

// @desc    Get single module with content
// @route   GET /api/v1/modules/:id
// @access  Public
export const getModule = async (req: Request, res: Response): Promise<void> => {
  try {
    const module = await Module.findById(req.params.id).populate('topics');

    if (!module) {
      res.status(404).json({
        success: false,
        message: 'Module not found',
      });
      return;
    }

    // Fetch content from GitHub
    let content = null;
    try {
      content = await githubService.fetchModuleContent(module.githubPath);
    } catch (error: any) {
      console.error('Failed to fetch content from GitHub:', error.message);
    }

    res.status(200).json({
      success: true,
      data: {
        ...module.toObject(),
        content,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch module',
      error: error.message,
    });
  }
};

// @desc    Get topics by module
// @route   GET /api/v1/modules/:moduleId/topics
// @access  Public
export const getTopicsByModule = async (req: Request, res: Response) => {
  try {
    const topics = await Topic.find({
      moduleId: req.params.moduleId,
    }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: topics.length,
      data: topics,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch topics',
      error: error.message,
    });
  }
};

// @desc    Get single topic with content
// @route   GET /api/v1/topics/:id
// @access  Public
export const getTopic = async (req: Request, res: Response): Promise<void> => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      res.status(404).json({
        success: false,
        message: 'Topic not found',
      });
      return;
    }

    // Fetch content from GitHub
    let content = null;
    try {
      content = await githubService.fetchTopicContent(topic.githubPath);
    } catch (error: any) {
      console.error('Failed to fetch content from GitHub:', error.message);
    }

    res.status(200).json({
      success: true,
      data: {
        ...topic.toObject(),
        content,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch topic',
      error: error.message,
    });
  }
};

// @desc    Create subject
// @route   POST /api/v1/subjects
// @access  Private (Admin)
export const createSubject = async (req: Request, res: Response) => {
  try {
    const subject = await Subject.create(req.body);

    res.status(201).json({
      success: true,
      data: subject,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to create subject',
      error: error.message,
    });
  }
};

// @desc    Create module
// @route   POST /api/v1/modules
// @access  Private (Admin)
export const createModule = async (req: Request, res: Response) => {
  try {
    const module = await Module.create(req.body);

    // Add module to subject
    await Subject.findByIdAndUpdate(module.subjectId, {
      $push: { modules: module._id },
    });

    res.status(201).json({
      success: true,
      data: module,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to create module',
      error: error.message,
    });
  }
};

// @desc    Create topic
// @route   POST /api/v1/topics
// @access  Private (Admin)
export const createTopic = async (req: Request, res: Response) => {
  try {
    const topic = await Topic.create(req.body);

    // Add topic to module
    await Module.findByIdAndUpdate(topic.moduleId, {
      $push: { topics: topic._id },
    });

    res.status(201).json({
      success: true,
      data: topic,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to create topic',
      error: error.message,
    });
  }
};

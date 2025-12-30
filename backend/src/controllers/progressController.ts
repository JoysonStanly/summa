import { Response } from 'express';
import { AuthRequest } from '../types';
import Progress from '../models/Progress';
import User from '../models/User';

/**
 * @desc    Get user progress for all problems
 * @route   GET /api/v1/progress/user/:userId
 * @access  Private
 */
export const getUserProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const progress = await Progress.find({ userId })
      .populate('problemId', 'title difficulty category')
      .sort({ lastAttemptDate: -1 });

    const stats = {
      totalProblems: progress.length,
      completedProblems: progress.filter((p) => p.completed).length,
      attemptedProblems: progress.length,
      completionRate: progress.length > 0
        ? Math.round(
            (progress.filter((p) => p.completed).length / progress.length) * 100
          )
        : 0,
    };

    res.status(200).json({
      success: true,
      data: {
        progress,
        stats,
      },
    });
  } catch (error: any) {
    console.error('Get user progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching progress',
      error: error.message,
    });
  }
};

/**
 * @desc    Get progress for a specific problem
 * @route   GET /api/v1/progress/problem/:problemId
 * @access  Private
 */
export const getProblemProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { problemId } = req.params;
    const userId = req.user?._id;

    const progress = await Progress.findOne({ userId, problemId })
      .populate('problemId', 'title difficulty category')
      .populate('submissions');

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error: any) {
    console.error('Get problem progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching progress',
      error: error.message,
    });
  }
};

/**
 * @desc    Get user streak data
 * @route   GET /api/v1/progress/streak/:userId
 * @access  Private
 */
export const getUserStreak = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('streakData');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user.streakData,
    });
  } catch (error: any) {
    console.error('Get streak error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching streak data',
      error: error.message,
    });
  }
};

/**
 * @desc    Update progress (time spent, etc.)
 * @route   PUT /api/v1/progress
 * @access  Private
 */
export const updateProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { problemId, timeSpent } = req.body;
    const userId = req.user?._id;

    let progress = await Progress.findOne({ userId, problemId });

    if (!progress) {
      progress = await Progress.create({
        userId,
        problemId,
        timeSpent: timeSpent || 0,
        attempts: 0,
      });
    } else {
      if (timeSpent) {
        progress.timeSpent += timeSpent;
      }
      progress.lastAttemptDate = new Date();
      await progress.save();
    }

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error: any) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating progress',
      error: error.message,
    });
  }
};

/**
 * @desc    Get current user's progress
 * @route   GET /api/v1/progress
 * @access  Private
 */
export const getMyProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    const progressRecords = await Progress.find({ userId });
    const user = await User.findById(userId);

    const completedProblems = progressRecords
      .filter((p) => p.completed)
      .map((p) => p.problemId.toString());

    const data = {
      userId: userId?.toString() || '',
      problemsSolved: completedProblems.length,
      totalSubmissions: progressRecords.reduce((sum, p) => sum + p.attempts, 0),
      acceptedSubmissions: completedProblems.length,
      streak: user?.streakData?.currentStreak || 0,
      lastActiveDate: new Date().toISOString(),
      completedProblems,
    };

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Get my progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching progress',
      error: error.message,
    });
  }
};

/**
 * @desc    Get current user's statistics
 * @route   GET /api/v1/progress/stats
 * @access  Private
 */
export const getMyStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    const progressRecords = await Progress.find({ userId }).populate('problemId', 'difficulty category');
    const Problem = require('../models/Problem').default;
    const totalProblems = await Problem.countDocuments();

    const easySolved = progressRecords.filter(
      (p: any) => p.completed && p.problemId?.difficulty === 'easy'
    ).length;
    const mediumSolved = progressRecords.filter(
      (p: any) => p.completed && p.problemId?.difficulty === 'medium'
    ).length;
    const hardSolved = progressRecords.filter(
      (p: any) => p.completed && p.problemId?.difficulty === 'hard'
    ).length;

    const data = {
      totalProblems,
      easySolved,
      mediumSolved,
      hardSolved,
      topicProgress: {},
      recentActivity: [],
    };

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message,
    });
  }
};

/**
 * @desc    Create/update progress
 * @route   POST /api/v1/progress
 * @access  Private
 */
export const createProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { problemId, action } = req.body;
    const userId = req.user?._id;

    let progress = await Progress.findOne({ userId, problemId });

    if (!progress) {
      progress = await Progress.create({
        userId,
        problemId,
        attempts: action === 'attempted' ? 1 : 0,
        completed: action === 'solved',
        lastAttemptDate: new Date(),
      });
    } else {
      if (action === 'attempted') {
        progress.attempts += 1;
      }
      if (action === 'solved') {
        progress.completed = true;
      }
      progress.lastAttemptDate = new Date();
      await progress.save();
    }

    // Update user streak
    if (action === 'solved') {
      const user = await User.findById(userId);
      if (user) {
        user.streakData.currentStreak = (user.streakData?.currentStreak || 0) + 1;
        user.streakData.lastActiveDate = new Date();
        await user.save();
      }
    }

    // Return updated progress data
    const progressRecords = await Progress.find({ userId });
    const completedProblems = progressRecords
      .filter((p) => p.completed)
      .map((p) => p.problemId.toString());

    const user = await User.findById(userId);
    const data = {
      userId: userId?.toString() || '',
      problemsSolved: completedProblems.length,
      totalSubmissions: progressRecords.reduce((sum, p) => sum + p.attempts, 0),
      acceptedSubmissions: completedProblems.length,
      streak: user?.streakData?.currentStreak || 0,
      lastActiveDate: new Date().toISOString(),
      completedProblems,
    };

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Create progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating progress',
      error: error.message,
    });
  }
};

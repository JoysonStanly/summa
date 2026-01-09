import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../types';
import Progress from '../models/Progress';
import User from '../models/User';
import Problem from '../models/Problem';
import { updateUserStreak } from '../utils/streakHelper';

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
    console.log('🔥 getUserStreak called for userId:', userId);

    const user = await User.findById(userId).select('streakData dailyCheckedProblems');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Get all progress records with dates to build calendar
    const progressRecords = await Progress.find({ userId }).select('lastAttemptDate');
    
    // Build array of unique dates where user was active
    const streakDays = new Set<string>();
    progressRecords.forEach(record => {
      if (record.lastAttemptDate) {
        const date = new Date(record.lastAttemptDate);
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        streakDays.add(dateStr);
      }
    });

    // Include dates from dailyCheckedProblems (checkbox clicks)
    if (user.dailyCheckedProblems && user.dailyCheckedProblems.length > 0) {
      console.log('Adding dailyCheckedProblems to streakDays:', {
        count: user.dailyCheckedProblems.length,
        problems: user.dailyCheckedProblems.map((item: any) => ({
          problemId: item.problemId.toString(),
          checkedDate: item.checkedDate
        }))
      });
      user.dailyCheckedProblems.forEach((item: any) => {
        if (item.checkedDate) {
          const date = new Date(item.checkedDate);
          const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          streakDays.add(dateStr);
        }
      });
    }

    // Include today if streak is active
    if (user.streakData.lastActiveDate) {
      const lastActive = new Date(user.streakData.lastActiveDate);
      const dateStr = `${lastActive.getFullYear()}-${String(lastActive.getMonth() + 1).padStart(2, '0')}-${String(lastActive.getDate()).padStart(2, '0')}`;
      streakDays.add(dateStr);
    }

    console.log('Final streakDays:', Array.from(streakDays));

    res.status(200).json({
      success: true,
      data: {
        currentStreak: user.streakData.currentStreak,
        maxStreak: user.streakData.maxStreak,
        lastActiveDate: user.streakData.lastActiveDate,
        streakDays: Array.from(streakDays)
      },
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

    console.log('createProgress called:', { action, problemId, userId: userId?.toString() });

    // Convert problemId (slug) to ObjectId
    let actualProblemId = problemId;
    if (problemId && !mongoose.Types.ObjectId.isValid(problemId)) {
      // If problemId is not a valid ObjectId, treat it as a slug and look up the problem
      const problem = await Problem.findOne({ slug: problemId });
      if (!problem) {
        res.status(404).json({
          success: false,
          message: 'Problem not found',
        });
        return;
      }
      actualProblemId = problem._id;
      console.log('Converted slug to ObjectId:', { slug: problemId, objectId: actualProblemId.toString() });
    }

    // For 'streak' action, we don't need problemId - just update user streak
    if (action === 'streak') {
      await updateUserStreak(userId?.toString() || '');
      
      // Also save the checked problem for today
      if (actualProblemId) {
        const user = await User.findById(userId);
        if (user) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          // Remove old entries for this problem
          user.dailyCheckedProblems = user.dailyCheckedProblems.filter(
            (item: any) => item.problemId.toString() !== actualProblemId.toString()
          );
          
          // Add new entry
          user.dailyCheckedProblems.push({
            problemId: actualProblemId,
            checkedDate: today,
          });
          
          console.log('Saving problem to dailyCheckedProblems:', {
            problemId: actualProblemId.toString(),
            checkedDate: today.toISOString(),
            totalChecked: user.dailyCheckedProblems.length
          });
          
          await user.save();
          console.log('Problem saved to dailyCheckedProblems successfully');
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
      return;
    }

    // For 'attempted' and 'solved' actions, we need a valid problemId
    let progress = await Progress.findOne({ userId, problemId: actualProblemId });

    if (!progress) {
      progress = await Progress.create({
        userId,
        problemId: actualProblemId,
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

    // Update user streak for 'solved' action
    if (action === 'solved') {
      await updateUserStreak(userId?.toString() || '');
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

/**
 * @desc    Get user's checked problems for today
 * @route   GET /api/v1/progress/checked
 * @access  Private
 */
export const getCheckedProblems = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    
    const user = await User.findById(userId).select('dailyCheckedProblems');
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }
    
    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filter checked problems for today
    const checkedToday = user.dailyCheckedProblems
      .filter((item: any) => {
        const checkedDate = new Date(item.checkedDate);
        checkedDate.setHours(0, 0, 0, 0);
        return checkedDate.getTime() === today.getTime();
      })
      .map((item: any) => item.problemId.toString());
    
    res.status(200).json({
      success: true,
      data: checkedToday,
    });
  } catch (error: any) {
    console.error('Get checked problems error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching checked problems',
      error: error.message,
    });
  }
};

/**
 * @desc    Uncheck a problem (remove from daily checked problems)
 * @route   POST /api/v1/progress/uncheck
 * @access  Private
 */
export const uncheckProblem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { problemId } = req.body;
    const userId = req.user?._id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Remove the problem from dailyCheckedProblems
    user.dailyCheckedProblems = user.dailyCheckedProblems.filter(
      (item: any) => item.problemId.toString() !== problemId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Problem unchecked successfully',
    });
  } catch (error: any) {
    console.error('Uncheck problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Error unchecking problem',
      error: error.message,
    });
  }
};

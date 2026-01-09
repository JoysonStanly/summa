import { Request, Response } from 'express';
import { AuthRequest } from '../types';
import User from '../models/User';
import Progress from '../models/Progress';
import Submission from '../models/Submission';

// Helper to format user data for response
const formatUserData = (user: any) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar || '',
  bio: user.bio || '',
  mobile: user.mobile || '',
  countryCode: user.countryCode || '+91',
  location: user.location || '',
  university: user.university || '',
  educationYear: user.educationYear || '',
  skills: user.skills || [],
  socialLinks: user.socialLinks || {},
  projects: user.projects || [],
  coins: user.coins,
  completedProblems: user.completedProblems,
  streakData: user.streakData,
  createdAt: user.createdAt,
});

// @desc    Get current user's profile
// @route   GET /api/v1/profile/me
// @access  Private
export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get progress stats
    const progress = await Progress.find({ userId: user._id });
    const completedCount = progress.filter((p) => p.completed).length;
    const totalAttempts = progress.reduce((sum, p) => sum + p.attempts, 0);
    const totalTimeSpent = progress.reduce((sum, p) => sum + p.timeSpent, 0);

    // Get submission stats
    const submissions = await Submission.find({ userId: user._id });
    const acceptedSubmissions = submissions.filter(
      (s) => s.status === 'accepted'
    ).length;
    const totalSubmissions = submissions.length;

    // Calculate accuracy
    const accuracy =
      totalSubmissions > 0
        ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(2)
        : '0.00';

    res.status(200).json({
      success: true,
      data: {
        user: formatUserData(user),
        stats: {
          problemsSolved: completedCount,
          totalAttempts,
          totalSubmissions,
          acceptedSubmissions,
          accuracy: `${accuracy}%`,
          totalTimeSpent: Math.floor(totalTimeSpent / 60),
          currentStreak: user.streakData.currentStreak,
          maxStreak: user.streakData.maxStreak,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message,
    });
  }
};

// @desc    Get user profile by username/name
// @route   GET /api/v1/profile/user/:username
// @access  Public
export const getUserProfileByUsername = async (req: Request, res: Response) => {
  try {
    const username = decodeURIComponent(req.params.username);
    
    // Find user by name (case-insensitive)
    const user = await User.findOne({ 
      name: { $regex: new RegExp(`^${username}$`, 'i') }
    }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get progress stats
    const progress = await Progress.find({ userId: user._id });
    const completedCount = progress.filter((p) => p.completed).length;
    const totalAttempts = progress.reduce((sum, p) => sum + p.attempts, 0);
    const totalTimeSpent = progress.reduce((sum, p) => sum + p.timeSpent, 0);

    // Get submission stats
    const submissions = await Submission.find({ userId: user._id });
    const acceptedSubmissions = submissions.filter(
      (s) => s.status === 'accepted'
    ).length;
    const totalSubmissions = submissions.length;

    // Calculate accuracy
    const accuracy =
      totalSubmissions > 0
        ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(2)
        : '0.00';

    res.status(200).json({
      success: true,
      data: {
        user: formatUserData(user),
        stats: {
          problemsSolved: completedCount,
          totalAttempts,
          totalSubmissions,
          acceptedSubmissions,
          accuracy: `${accuracy}%`,
          totalTimeSpent: Math.floor(totalTimeSpent / 60),
          currentStreak: user.streakData.currentStreak,
          maxStreak: user.streakData.maxStreak,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message,
    });
  }
};

// @desc    Get user profile
// @route   GET /api/v1/profile/:userId
// @access  Public
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get progress stats
    const progress = await Progress.find({ userId: user._id });
    const completedCount = progress.filter((p) => p.completed).length;
    const totalAttempts = progress.reduce((sum, p) => sum + p.attempts, 0);
    const totalTimeSpent = progress.reduce((sum, p) => sum + p.timeSpent, 0);

    // Get submission stats
    const submissions = await Submission.find({ userId: user._id });
    const acceptedSubmissions = submissions.filter(
      (s) => s.status === 'accepted'
    ).length;
    const totalSubmissions = submissions.length;

    // Calculate accuracy
    const accuracy =
      totalSubmissions > 0
        ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(2)
        : '0.00';

    res.status(200).json({
      success: true,
      data: {
        user: formatUserData(user),
        stats: {
          problemsSolved: completedCount,
          totalAttempts,
          totalSubmissions,
          acceptedSubmissions,
          accuracy: `${accuracy}%`,
          totalTimeSpent: Math.floor(totalTimeSpent / 60), // in minutes
          currentStreak: user.streakData.currentStreak,
          maxStreak: user.streakData.maxStreak,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      name, 
      bio, 
      avatar, 
      mobile,
      countryCode,
      location, 
      university,
      educationYear,
      skills,
      socialLinks,
      projects
    } = req.body;

    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update allowed fields
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    if (mobile !== undefined) user.mobile = mobile;
    if (countryCode !== undefined) user.countryCode = countryCode;
    if (location !== undefined) user.location = location;
    if (university !== undefined) user.university = university;
    if (educationYear !== undefined) user.educationYear = educationYear;
    if (skills !== undefined) user.skills = skills;
    if (socialLinks !== undefined) user.socialLinks = socialLinks;
    if (projects !== undefined) user.projects = projects;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: formatUserData(user),
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

// @desc    Get current user's activity
// @route   GET /api/v1/profile/activity/me
// @access  Private
export const getMyActivity = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { limit = 20 } = req.query;

    // Get recent submissions
    const recentSubmissions = await Submission.find({ userId })
      .populate('problemId', 'title slug difficulty')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    // Get activity heatmap data (last 365 days)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const submissions = await Submission.find({
      userId,
      createdAt: { $gte: oneYearAgo },
    }).select('createdAt status');

    // Group by date
    const activityMap: { [key: string]: number } = {};
    submissions.forEach((submission) => {
      const date = submission.createdAt.toISOString().split('T')[0];
      activityMap[date] = (activityMap[date] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: {
        recentSubmissions,
        activityHeatmap: activityMap,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity',
      error: error.message,
    });
  }
};

// @desc    Get user activity
// @route   GET /api/v1/profile/activity/:userId
// @access  Public
export const getUserActivity = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit = 20 } = req.query;

    // Get recent submissions
    const recentSubmissions = await Submission.find({ userId })
      .populate('problemId', 'title slug difficulty')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    // Get activity heatmap data (last 365 days)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const submissions = await Submission.find({
      userId,
      createdAt: { $gte: oneYearAgo },
    }).select('createdAt status');

    // Group by date
    const activityMap: { [key: string]: number } = {};
    submissions.forEach((submission) => {
      const date = submission.createdAt.toISOString().split('T')[0];
      activityMap[date] = (activityMap[date] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: {
        recentSubmissions,
        activityHeatmap: activityMap,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user activity',
      error: error.message,
    });
  }
};

// @desc    Get user problem stats by difficulty
// @route   GET /api/v1/profile/stats/:userId
// @access  Public
export const getUserProblemStats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate({
      path: 'completedProblems',
      select: 'difficulty category',
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Count by difficulty
    const stats = {
      easy: 0,
      medium: 0,
      hard: 0,
      byCategory: {} as { [key: string]: number },
    };

    user.completedProblems.forEach((problem: any) => {
      const difficulty = problem.difficulty?.toLowerCase();
      if (difficulty === 'easy') stats.easy++;
      else if (difficulty === 'medium') stats.medium++;
      else if (difficulty === 'hard') stats.hard++;

      // Count by category
      const category = problem.category;
      if (category) {
        stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
      }
    });

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch problem stats',
      error: error.message,
    });
  }
};

// @desc    Change password
// @route   PUT /api/v1/profile/password
// @access  Private
export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      });
    }

    const user = await User.findById(req.user?._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Validate new password
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message,
    });
  }
};

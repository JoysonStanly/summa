import { Request, Response } from 'express';
import User from '../models/User';
import Problem from '../models/Problem';
import Submission from '../models/Submission';
import Session from '../models/Session';
import Quiz from '../models/Quiz';

// @desc    Get admin dashboard analytics
// @route   GET /api/v1/analytics/dashboard
// @access  Private (Admin)
export const getDashboardAnalytics = async (req: Request, res: Response) => {
  try {
    // User stats
    const totalUsers = await User.countDocuments();
    const studentCount = await User.countDocuments({ role: 'student' });
    const instructorCount = await User.countDocuments({ role: 'instructor' });
    const adminCount = await User.countDocuments({ role: 'admin' });

    // Problem stats
    const totalProblems = await Problem.countDocuments();
    const easyProblems = await Problem.countDocuments({ difficulty: 'easy' });
    const mediumProblems = await Problem.countDocuments({
      difficulty: 'medium',
    });
    const hardProblems = await Problem.countDocuments({ difficulty: 'hard' });

    // Submission stats
    const totalSubmissions = await Submission.countDocuments();
    const acceptedSubmissions = await Submission.countDocuments({
      status: 'accepted',
    });
    const overallAccuracy =
      totalSubmissions > 0
        ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(2)
        : '0.00';

    // Session stats
    const totalSessions = await Session.countDocuments();
    const upcomingSessions = await Session.countDocuments({
      date: { $gte: new Date() },
    });

    // Quiz stats
    const totalQuizzes = await Quiz.countDocuments();

    // User growth (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsersLast30Days = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Active users (submitted in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activeUsers = await Submission.distinct('userId', {
      createdAt: { $gte: sevenDaysAgo },
    });

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          students: studentCount,
          instructors: instructorCount,
          admins: adminCount,
          newLast30Days: newUsersLast30Days,
          activeLast7Days: activeUsers.length,
        },
        problems: {
          total: totalProblems,
          easy: easyProblems,
          medium: mediumProblems,
          hard: hardProblems,
        },
        submissions: {
          total: totalSubmissions,
          accepted: acceptedSubmissions,
          accuracy: `${overallAccuracy}%`,
        },
        sessions: {
          total: totalSessions,
          upcoming: upcomingSessions,
        },
        quizzes: {
          total: totalQuizzes,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard analytics',
      error: error.message,
    });
  }
};

// @desc    Get user growth analytics
// @route   GET /api/v1/analytics/user-growth
// @access  Private (Admin)
export const getUserGrowthAnalytics = async (req: Request, res: Response) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    const users = await User.find({
      createdAt: { $gte: startDate },
    }).select('createdAt role');

    // Group by date
    const growthData: { [key: string]: { total: number; students: number; instructors: number } } = {};

    users.forEach((user) => {
      const date = user.createdAt.toISOString().split('T')[0];
      if (!growthData[date]) {
        growthData[date] = { total: 0, students: 0, instructors: 0 };
      }
      growthData[date].total++;
      if (user.role === 'student') growthData[date].students++;
      if (user.role === 'instructor') growthData[date].instructors++;
    });

    res.status(200).json({
      success: true,
      data: growthData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user growth analytics',
      error: error.message,
    });
  }
};

// @desc    Get submission analytics
// @route   GET /api/v1/analytics/submissions
// @access  Private (Admin)
export const getSubmissionAnalytics = async (req: Request, res: Response) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    const submissions = await Submission.find({
      createdAt: { $gte: startDate },
    }).select('createdAt status language');

    // Group by date
    const analyticsData: { [key: string]: any } = {};

    submissions.forEach((submission) => {
      const date = submission.createdAt.toISOString().split('T')[0];
      if (!analyticsData[date]) {
        analyticsData[date] = {
          total: 0,
          accepted: 0,
          rejected: 0,
          languages: {},
        };
      }
      analyticsData[date].total++;
      if (submission.status === 'accepted') analyticsData[date].accepted++;
      if (submission.status === 'rejected') analyticsData[date].rejected++;

      const lang = submission.language;
      analyticsData[date].languages[lang] =
        (analyticsData[date].languages[lang] || 0) + 1;
    });

    // Language distribution
    const languageStats: { [key: string]: number } = {};
    submissions.forEach((s) => {
      languageStats[s.language] = (languageStats[s.language] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: {
        daily: analyticsData,
        languageDistribution: languageStats,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submission analytics',
      error: error.message,
    });
  }
};

// @desc    Get popular problems
// @route   GET /api/v1/analytics/popular-problems
// @access  Private (Admin)
export const getPopularProblems = async (req: Request, res: Response) => {
  try {
    const problems = await Problem.find()
      .select('title slug submissionCount acceptanceRate difficulty')
      .sort({ submissionCount: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: problems.length,
      data: problems,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular problems',
      error: error.message,
    });
  }
};

// @desc    Get category-wise problem stats
// @route   GET /api/v1/analytics/category-stats
// @access  Private (Admin)
export const getCategoryStats = async (req: Request, res: Response) => {
  try {
    const problems = await Problem.find().select('category difficulty');

    const categoryStats: { [key: string]: { total: number; easy: number; medium: number; hard: number } } = {};

    problems.forEach((problem) => {
      const category = problem.category;
      if (!categoryStats[category]) {
        categoryStats[category] = { total: 0, easy: 0, medium: 0, hard: 0 };
      }
      categoryStats[category].total++;
      const diff = problem.difficulty.toLowerCase();
      if (diff === 'easy') categoryStats[category].easy++;
      else if (diff === 'medium') categoryStats[category].medium++;
      else if (diff === 'hard') categoryStats[category].hard++;
    });

    res.status(200).json({
      success: true,
      data: categoryStats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category stats',
      error: error.message,
    });
  }
};

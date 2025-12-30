import { Request, Response } from 'express';
import User from '../models/User';

// @desc    Get leaderboard
// @route   GET /api/v1/leaderboard
// @access  Public
export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const { limit = 50, skip = 0 } = req.query;

    const users = await User.find()
      .select('name email coins streakData completedProblems')
      .sort({ coins: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    // Calculate rank and additional stats
    const leaderboard = users.map((user, index) => ({
      rank: Number(skip) + index + 1,
      userId: user._id,
      name: user.name,
      email: user.email,
      coins: user.coins,
      currentStreak: user.streakData.currentStreak,
      maxStreak: user.streakData.maxStreak,
      problemsSolved: user.completedProblems.length,
    }));

    // Get total user count for pagination
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      total: totalUsers,
      data: leaderboard,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard',
      error: error.message,
    });
  }
};

// @desc    Get user rank
// @route   GET /api/v1/leaderboard/rank/:userId
// @access  Public
export const getUserRank = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.userId).select(
      'name email coins streakData completedProblems'
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Calculate rank by counting users with more coins
    const rank =
      (await User.countDocuments({ coins: { $gt: user.coins } })) + 1;

    res.status(200).json({
      success: true,
      data: {
        rank,
        userId: user._id,
        name: user.name,
        email: user.email,
        coins: user.coins,
        currentStreak: user.streakData.currentStreak,
        maxStreak: user.streakData.maxStreak,
        problemsSolved: user.completedProblems.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user rank',
      error: error.message,
    });
  }
};

// @desc    Get top performers by category
// @route   GET /api/v1/leaderboard/top
// @access  Public
export const getTopPerformers = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Top by coins
    const topByCoins = await User.find()
      .select('name coins')
      .sort({ coins: -1 })
      .limit(10);

    // Top by current streak
    const topByStreak = await User.find()
      .select('name streakData.currentStreak')
      .sort({ 'streakData.currentStreak': -1 })
      .limit(10);

    // Top by problems solved
    const topByProblems = await User.find()
      .select('name completedProblems')
      .sort({ completedProblems: -1 })
      .limit(10)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        topByCoins: topByCoins.map((user, index) => ({
          rank: index + 1,
          name: user.name,
          coins: user.coins,
        })),
        topByStreak: topByStreak.map((user, index) => ({
          rank: index + 1,
          name: user.name,
          streak: user.streakData.currentStreak,
        })),
        topByProblems: topByProblems.map((user: any, index) => ({
          rank: index + 1,
          name: user.name,
          problemsSolved: user.completedProblems.length,
        })),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top performers',
      error: error.message,
    });
  }
};

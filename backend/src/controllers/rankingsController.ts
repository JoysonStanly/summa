import { Request, Response } from 'express';
import User from '../models/User';
import Problem from '../models/Problem';

// @desc    Get category-wise rankings
// @route   GET /api/v1/rankings/category/:category
// @access  Public
export const getCategoryRankings = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const { limit = 50 } = req.query;

    // Get all problems in this category
    const categoryProblems = await Problem.find({ category }).select('_id');
    const problemIds = categoryProblems.map((p) => p._id);

    // Find users who solved problems in this category
    const users = await User.find({
      completedProblems: { $in: problemIds },
    })
      .select('name email coins completedProblems')
      .lean();

    // Calculate category-specific score
    const rankings = users
      .map((user) => {
        const categoryProblemsCompleted = user.completedProblems.filter(
          (problemId: any) =>
            problemIds.some((id) => id.toString() === problemId.toString())
        );

        return {
          userId: user._id,
          name: user.name,
          email: user.email,
          problemsSolved: categoryProblemsCompleted.length,
          totalCoins: user.coins,
        };
      })
      .filter((user) => user.problemsSolved > 0)
      .sort((a, b) => b.problemsSolved - a.problemsSolved)
      .slice(0, Number(limit))
      .map((user, index) => ({
        rank: index + 1,
        ...user,
      }));

    res.status(200).json({
      success: true,
      category,
      count: rankings.length,
      data: rankings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category rankings',
      error: error.message,
    });
  }
};

// @desc    Get difficulty-wise rankings
// @route   GET /api/v1/rankings/difficulty/:difficulty
// @access  Public
export const getDifficultyRankings = async (req: Request, res: Response) => {
  try {
    const { difficulty } = req.params;
    const { limit = 50 } = req.query;

    // Get all problems with this difficulty
    const difficultyProblems = await Problem.find({ difficulty }).select('_id');
    const problemIds = difficultyProblems.map((p) => p._id);

    const users = await User.find({
      completedProblems: { $in: problemIds },
    })
      .select('name email completedProblems')
      .lean();

    const rankings = users
      .map((user) => {
        const difficultyProblemsCompleted = user.completedProblems.filter(
          (problemId: any) =>
            problemIds.some((id) => id.toString() === problemId.toString())
        );

        return {
          userId: user._id,
          name: user.name,
          email: user.email,
          problemsSolved: difficultyProblemsCompleted.length,
        };
      })
      .filter((user) => user.problemsSolved > 0)
      .sort((a, b) => b.problemsSolved - a.problemsSolved)
      .slice(0, Number(limit))
      .map((user, index) => ({
        rank: index + 1,
        ...user,
      }));

    res.status(200).json({
      success: true,
      difficulty,
      count: rankings.length,
      data: rankings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch difficulty rankings',
      error: error.message,
    });
  }
};

// @desc    Get user mastery by category
// @route   GET /api/v1/rankings/mastery/:userId
// @access  Public
export const getUserMastery = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId).populate({
      path: 'completedProblems',
      select: 'category difficulty',
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get all problems count by category
    const allProblems = await Problem.find().select('category difficulty');

    const categoryMastery: { [key: string]: any } = {};

    // Count total problems per category
    allProblems.forEach((problem) => {
      const category = problem.category;
      if (!categoryMastery[category]) {
        categoryMastery[category] = {
          total: 0,
          solved: 0,
          easy: { total: 0, solved: 0 },
          medium: { total: 0, solved: 0 },
          hard: { total: 0, solved: 0 },
        };
      }
      categoryMastery[category].total++;

      const diff = problem.difficulty.toLowerCase();
      if (diff === 'easy') categoryMastery[category].easy.total++;
      else if (diff === 'medium') categoryMastery[category].medium.total++;
      else if (diff === 'hard') categoryMastery[category].hard.total++;
    });

    // Count solved problems per category
    user.completedProblems.forEach((problem: any) => {
      const category = problem.category;
      if (categoryMastery[category]) {
        categoryMastery[category].solved++;

        const diff = problem.difficulty?.toLowerCase();
        if (diff === 'easy') categoryMastery[category].easy.solved++;
        else if (diff === 'medium') categoryMastery[category].medium.solved++;
        else if (diff === 'hard') categoryMastery[category].hard.solved++;
      }
    });

    // Calculate mastery percentage
    Object.keys(categoryMastery).forEach((category) => {
      const mastery = categoryMastery[category];
      mastery.masteryPercentage =
        mastery.total > 0
          ? ((mastery.solved / mastery.total) * 100).toFixed(2)
          : '0.00';
    });

    res.status(200).json({
      success: true,
      userId: user._id,
      userName: user.name,
      data: categoryMastery,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user mastery',
      error: error.message,
    });
  }
};

// @desc    Get all available categories
// @route   GET /api/v1/rankings/categories
// @access  Public
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Problem.distinct('category');

    // Get problem count per category
    const categoryCounts = await Promise.all(
      categories.map(async (category) => ({
        category,
        problemCount: await Problem.countDocuments({ category }),
      }))
    );

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categoryCounts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message,
    });
  }
};

// @desc    Get weekly champions (most problems solved this week)
// @route   GET /api/v1/rankings/weekly-champions
// @access  Public
export const getWeeklyChampions = async (req: Request, res: Response) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // This would require tracking when problems were completed
    // For now, return top users by current streak
    const users = await User.find()
      .select('name email streakData.currentStreak completedProblems')
      .sort({ 'streakData.currentStreak': -1 })
      .limit(10);

    const champions = users.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      name: user.name,
      email: user.email,
      currentStreak: user.streakData.currentStreak,
      totalProblemsSolved: user.completedProblems.length,
    }));

    res.status(200).json({
      success: true,
      count: champions.length,
      data: champions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weekly champions',
      error: error.message,
    });
  }
};

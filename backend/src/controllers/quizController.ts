import { Response } from 'express';
import { AuthRequest } from '../types';
import Quiz from '../models/Quiz';
import User from '../models/User';

// @desc    Get all quizzes
// @route   GET /api/v1/quizzes
// @access  Public
export const getQuizzes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, difficulty } = req.query;

    const filter: any = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const quizzes = await Quiz.find(filter).select('-attempts');

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quizzes',
      error: error.message,
    });
  }
};

// @desc    Get single quiz
// @route   GET /api/v1/quizzes/:id
// @access  Public
export const getQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const quiz = await Quiz.findById(req.params.id).select('-attempts');

    if (!quiz) {
      res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz',
      error: error.message,
    });
  }
};

// @desc    Get quiz questions from GitHub
// @route   GET /api/v1/quizzes/:id/questions
// @access  Private
export const getQuizQuestions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
      return;
    }

    // Questions fetching disabled (githubService removed)
    const questions: any[] = [];

    res.status(200).json({
      success: true,
      data: {
        quizId: quiz._id,
        title: quiz.title,
        category: quiz.category,
        difficulty: quiz.difficulty,
        timeLimit: quiz.timeLimit,
        questions,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz questions',
      error: error.message,
    });
  }
};

// @desc    Submit quiz attempt
// @route   POST /api/v1/quizzes/:id/submit
// @access  Private
export const submitQuizAttempt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
      return;
    }

    // Questions fetching disabled (githubService removed)
    const questions: any[] = [];

    // Calculate score
    let score = 0;
    const results = questions.map((question: any, index: number) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) score++;

      return {
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
      };
    });

    // Save attempt
    quiz.attempts.push({
      userId: req.user?._id as any,
      score,
      totalQuestions: questions.length,
      completedAt: new Date(),
    });
    await quiz.save();

    // Award coins based on score percentage
    const percentage = (score / questions.length) * 100;
    let coinsEarned = 0;
    if (percentage >= 90) coinsEarned = 50;
    else if (percentage >= 75) coinsEarned = 30;
    else if (percentage >= 60) coinsEarned = 20;

    if (coinsEarned > 0) {
      await User.findByIdAndUpdate(req.user?._id, {
        $inc: { coins: coinsEarned },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        score,
        totalQuestions: questions.length,
        percentage: percentage.toFixed(2),
        coinsEarned,
        results,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit quiz',
      error: error.message,
    });
  }
};

// @desc    Get user quiz attempts
// @route   GET /api/v1/quizzes/attempts
// @access  Private
export const getUserQuizAttempts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const quizzes = await Quiz.find({
      'attempts.userId': req.user?._id,
    }).select('title category difficulty timeLimit attempts');

    const userAttempts = quizzes.map((quiz) => ({
      quizId: quiz._id,
      title: quiz.title,
      category: quiz.category,
      difficulty: quiz.difficulty,
      attempts: quiz.attempts.filter(
        (attempt) => attempt.userId.toString() === req.user?._id
      ),
    }));

    res.status(200).json({
      success: true,
      count: userAttempts.length,
      data: userAttempts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz attempts',
      error: error.message,
    });
  }
};

// @desc    Create quiz
// @route   POST /api/v1/quizzes
// @access  Private (Admin)
export const createQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const quiz = await Quiz.create(req.body);

    res.status(201).json({
      success: true,
      data: quiz,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to create quiz',
      error: error.message,
    });
  }
};

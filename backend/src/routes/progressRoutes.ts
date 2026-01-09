import express from 'express';
import {
  getUserProgress,
  getProblemProgress,
  getUserStreak,
  updateProgress,
  getMyProgress,
  getMyStats,
  createProgress,
  getCheckedProblems,
  uncheckProblem, // NEW
} from '../controllers/progressController';
import { protect } from '../middleware/auth';

const router = express.Router();

/**
 * @route   GET /api/v1/progress
 * @desc    Get current user's progress
 * @access  Private
 */
router.get('/', protect, getMyProgress);

/**
 * @route   POST /api/v1/progress
 * @desc    Create/update progress
 * @access  Private
 */
router.post('/', protect, createProgress);

/**
 * @route   GET /api/v1/progress/stats
 * @desc    Get current user's statistics
 * @access  Private
 */
router.get('/stats', protect, getMyStats);

/**
 * @route   GET /api/v1/progress/user/:userId
 * @desc    Get user progress for all problems
 * @access  Private
 */
router.get('/user/:userId', protect, getUserProgress);

/**
 * @route   GET /api/v1/progress/problem/:problemId
 * @desc    Get progress for specific problem
 * @access  Private
 */
router.get('/problem/:problemId', protect, getProblemProgress);

/**
 * @route   GET /api/v1/progress/streak/:userId
 * @desc    Get user streak data
 * @access  Private
 */
router.get('/streak/:userId', protect, getUserStreak);

/**
 * @route   PUT /api/v1/progress
 * @desc    Update progress (time spent, etc.)
 * @access  Private
 */
router.put('/', protect, updateProgress);

/**
 * @route   GET /api/v1/progress/checked
 * @desc    Get user's checked problems for today
 * @access  Private
 */
router.get('/checked', protect, getCheckedProblems);

/**
 * @route   POST /api/v1/progress/uncheck
 * @desc    Uncheck a problem (remove from daily checked problems)
 * @access  Private
 */
router.post('/uncheck', protect, uncheckProblem);

export default router;

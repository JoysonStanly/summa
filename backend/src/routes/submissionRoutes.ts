import express from 'express';
import {
  submitSolution,
  getUserSubmissions,
  getProblemSubmissions,
  getSubmission,
} from '../controllers/submissionController';
import { protect } from '../middleware/auth';

const router = express.Router();

/**
 * @route   POST /api/v1/submissions
 * @desc    Submit code solution
 * @access  Private
 */
router.post('/', protect, submitSolution);

/**
 * @route   GET /api/v1/submissions/:id
 * @desc    Get single submission by ID
 * @access  Private
 */
router.get('/:id', protect, getSubmission);

/**
 * @route   GET /api/v1/submissions/user/:userId
 * @desc    Get all submissions by user
 * @access  Private
 */
router.get('/user/:userId', protect, getUserSubmissions);

/**
 * @route   GET /api/v1/submissions/problem/:problemId
 * @desc    Get all submissions for a problem (user's own)
 * @access  Private
 */
router.get('/problem/:problemId', protect, getProblemSubmissions);

export default router;

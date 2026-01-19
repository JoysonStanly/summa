import express from 'express';
import {
  submitSolution,
  getUserSubmissions,
  getProblemSubmissions,
  getSubmission,
} from '../controllers/submissionController';


const router = express.Router();

/**
 * @route   POST /api/v1/submissions
 * @desc    Submit code solution
 * @access  Private
 */
router.post('/', submitSolution);

/**
 * @route   GET /api/v1/submissions/:id
 * @desc    Get single submission by ID
 * @access  Private
 */
router.get('/:id', getSubmission);

/**
 * @route   GET /api/v1/submissions/user/:userId
 * @desc    Get all submissions by user
 * @access  Private
 */
router.get('/user/:userId', getUserSubmissions);

/**
 * @route   GET /api/v1/submissions/problem/:problemId
 * @desc    Get all submissions for a problem (user's own)
 * @access  Private
 */
router.get('/problem/:problemId', getProblemSubmissions);

export default router;

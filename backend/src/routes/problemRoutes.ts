import express from 'express';
import {
  getProblems,
  getProblem,
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemEditorial,
  getProblemTestCases,
  getProblemStarterCode,
  likeProblem,
  dislikeProblem,
} from '../controllers/problemController';
import { protect, authorize } from '../middleware/auth';
import { optionalAuth } from '../middleware/optionalAuth';

const router = express.Router();

/**
 * @route   GET /api/v1/problems
 * @desc    Get all problems with optional filters
 * @access  Public (but filtered by published status)
 */
router.get('/', getProblems);

/**
 * @route   GET /api/v1/problems/:id/editorial
 * @desc    Get problem editorial
 * @access  Public (requires problem access)
 */
router.get('/:id/editorial', getProblemEditorial);

/**
 * @route   GET /api/v1/problems/:id/testcases
 * @desc    Get problem test cases
 * @access  Public (hidden ones for admin only)
 */
router.get('/:id/testcases', getProblemTestCases);

/**
 * @route   GET /api/v1/problems/:id/startercode
 * @desc    Get problem starter code
 * @access  Public (requires problem access)
 */
router.get('/:id/startercode', getProblemStarterCode);

/**
 * @route   GET /api/v1/problems/:id
 * @desc    Get single problem by ID or slug
 * @access  Public (but checks published status)
 */
router.get('/:id', optionalAuth, getProblem);

/**
 * @route   POST /api/v1/problems
 * @desc    Create new problem
 * @access  Private (Admin only)
 */
router.post('/', protect, authorize('admin'), createProblem);

/**
 * @route   PUT /api/v1/problems/:id
 * @desc    Update problem
 * @access  Private (Admin only)
 */
router.put('/:id', protect, authorize('admin'), updateProblem);

/**
 * @route   DELETE /api/v1/problems/:id
 * @desc    Delete problem
 * @access  Private (Admin only)
 */
router.delete('/:id', protect, authorize('admin'), deleteProblem);

/**
 * @route   POST /api/v1/problems/:id/like
 * @desc    Like a problem
 * @access  Public
 */
router.post('/:id/like', likeProblem);

/**
 * @route   POST /api/v1/problems/:id/dislike
 * @desc    Dislike a problem
 * @access  Public
 */
router.post('/:id/dislike', dislikeProblem);

export default router;

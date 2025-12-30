import express from 'express';
import {
  getProblems,
  getProblem,
  createProblem,
  updateProblem,
  deleteProblem,
} from '../controllers/problemController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

/**
 * @route   GET /api/v1/problems
 * @desc    Get all problems with optional filters
 * @access  Public
 */
router.get('/', getProblems);

/**
 * @route   GET /api/v1/problems/:id
 * @desc    Get single problem by ID
 * @access  Public
 */
router.get('/:id', getProblem);

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

export default router;

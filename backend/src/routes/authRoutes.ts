import express from 'express';
import { validationResult } from 'express-validator';
import { 
  register, 
  login, 
  logout, 
  getMe, 
  getTotalUsers,
  getAllUsers,
  updateUser,
  deleteUser
} from '../controllers/authController';
import { protect, authorize } from '../middleware/auth';
import { registerValidation, loginValidation } from '../middleware/validation';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

/**
 * Middleware to check validation results
 */
const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  next();
};

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidation, validate, register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', loginValidation, validate, login);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', protect, logout);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
router.get('/me', protect, getMe);

/**
 * @route   GET /api/v1/users/count
 * @desc    Get total users count
 * @access  Public
 */
router.get('/users/count', getTotalUsers);

/**
 * @route   GET /api/v1/auth/users
 * @desc    Get all users (Admin only)
 * @access  Private/Admin
 */
router.get('/users', protect, authorize('admin'), getAllUsers);

/**
 * @route   PUT /api/v1/auth/users/:id
 * @desc    Update user (Admin only)
 * @access  Private/Admin
 */
router.put('/users/:id', protect, authorize('admin'), updateUser);

/**
 * @route   DELETE /api/v1/auth/users/:id
 * @desc    Delete user (Admin only)
 * @access  Private/Admin
 */
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

export default router;

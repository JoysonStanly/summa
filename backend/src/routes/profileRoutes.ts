import express from 'express';
import {
  getUserProfile,
  getMyProfile,
  getUserProfileByUsername,
  updateProfile,
  getUserActivity,
  getMyActivity,
  getUserProblemStats,
  updatePassword,
} from '../controllers/profileController';


const router = express.Router();

// Protected routes - must come before parameterized routes
router.route('/me').get(getMyProfile);
router.route('/activity/me').get(getMyActivity);
router.route('/').put(updateProfile);
router.route('/password').put(updatePassword);

// Public routes - get by username (must come before :userId)
router.route('/user/:username').get(getUserProfileByUsername);

// Public routes - parameterized
router.route('/:userId').get(getUserProfile);
router.route('/activity/:userId').get(getUserActivity);
router.route('/stats/:userId').get(getUserProblemStats);

export default router;

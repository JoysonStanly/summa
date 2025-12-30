import express from 'express';
import {
  getUserProfile,
  updateProfile,
  getUserActivity,
  getUserProblemStats,
  updatePassword,
} from '../controllers/profileController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.route('/').put(protect, updateProfile);
router.route('/password').put(protect, updatePassword);
router.route('/:userId').get(getUserProfile);
router.route('/activity/:userId').get(getUserActivity);
router.route('/stats/:userId').get(getUserProblemStats);

export default router;

import express from 'express';
import {
  getDashboardAnalytics,
  getUserGrowthAnalytics,
  getSubmissionAnalytics,
  getPopularProblems,
  getCategoryStats,
} from '../controllers/analyticsController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// All analytics routes require admin access
router.use(protect);
router.use(authorize('admin'));

router.route('/dashboard').get(getDashboardAnalytics);
router.route('/user-growth').get(getUserGrowthAnalytics);
router.route('/submissions').get(getSubmissionAnalytics);
router.route('/popular-problems').get(getPopularProblems);
router.route('/category-stats').get(getCategoryStats);

export default router;

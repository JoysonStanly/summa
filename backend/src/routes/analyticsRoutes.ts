import express from 'express';
import {
  getDashboardAnalytics,
  getUserGrowthAnalytics,
  getSubmissionAnalytics,
  getPopularProblems,
  getCategoryStats,
} from '../controllers/analyticsController';


const router = express.Router();



router.route('/dashboard').get(getDashboardAnalytics);
router.route('/user-growth').get(getUserGrowthAnalytics);
router.route('/submissions').get(getSubmissionAnalytics);
router.route('/popular-problems').get(getPopularProblems);
router.route('/category-stats').get(getCategoryStats);

export default router;

import express from 'express';
import {
  getBugReports,
  getBugReport,
  createBugReport,
  updateBugReport,
  deleteBugReport,
  getMyBugReports,
  assignBug,
} from '../controllers/bugController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/my-bugs').get(protect, getMyBugReports);

router
  .route('/')
  .get(protect, authorize('admin'), getBugReports)
  .post(protect, createBugReport);

router
  .route('/:id')
  .get(protect, getBugReport)
  .put(protect, authorize('admin'), updateBugReport)
  .delete(protect, authorize('admin'), deleteBugReport);

router.route('/:id/assign').put(protect, authorize('admin'), assignBug);

export default router;

import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
} from '../controllers/notificationController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router
  .route('/')
  .get(protect, getNotifications)
  .post(protect, authorize('admin'), createNotification);

router.route('/read-all').put(protect, markAllAsRead);
router
  .route('/:id')
  .delete(protect, deleteNotification);

router.route('/:id/read').put(protect, markAsRead);

export default router;

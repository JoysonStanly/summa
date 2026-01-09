import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  getAllNotifications,
  sendAdminNotification,
  updateAdminNotification,
  deleteAdminNotification,
} from '../controllers/notificationController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// User routes
router
  .route('/')
  .get(protect, getNotifications)
  .post(protect, authorize('admin'), createNotification);

router.route('/read-all').put(protect, markAllAsRead);
router
  .route('/:id')
  .delete(protect, deleteNotification);

router.route('/:id/read').put(protect, markAsRead);

// Admin routes
router.route('/admin/all').get(protect, authorize('admin'), getAllNotifications);

router
  .route('/admin/send')
  .post(protect, authorize('admin'), sendAdminNotification);

router
  .route('/admin/:id')
  .put(protect, authorize('admin'), updateAdminNotification)
  .delete(protect, authorize('admin'), deleteAdminNotification);

export default router;

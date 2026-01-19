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


const router = express.Router();

// User routes
router.get('/', getNotifications);
router.post('/', createNotification);

router.route('/read-all').put(markAllAsRead);
router.delete('/:id', deleteNotification);

router.route('/:id/read').put(markAsRead);

// Admin routes
router.route('/admin/all').get(getAllNotifications);

router.post('/admin/send', sendAdminNotification);

router.put('/admin/:id', updateAdminNotification);
router.delete('/admin/:id', deleteAdminNotification);

export default router;

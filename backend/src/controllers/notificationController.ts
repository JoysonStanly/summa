import { Response } from 'express';
import { AuthRequest } from '../types';
import Notification from '../models/Notification';
import SentNotification from '../models/SentNotification';
import User from '../models/User';

// @desc    Get user notifications
// @route   GET /api/v1/notifications
// @access  Private
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const { unreadOnly } = req.query;

    const filter: any = { userId: req.user?._id };
    if (unreadOnly === 'true') {
      filter.read = false;
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      userId: req.user?._id,
      read: false,
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message,
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/v1/notifications/:id/read
// @access  Private
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user?._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message,
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/v1/notifications/read-all
// @access  Private
export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    await Notification.updateMany(
      { userId: req.user?._id, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark all as read',
      error: error.message,
    });
  }
};

// @desc    Delete notification
// @route   DELETE /api/v1/notifications/:id
// @access  Private
export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user?._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Notification deleted',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message,
    });
  }
};

// @desc    Create notification (utility function)
// @route   POST /api/v1/notifications
// @access  Private (Admin/System)
export const createNotification = async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.create(req.body);

    res.status(201).json({
      success: true,
      data: notification,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message,
    });
  }
};

// Helper function to send notification (can be used internally)
export const sendNotification = async (
  userId: string,
  type: string,
  title: string,
  message: string,
  link?: string
) => {
  try {
    await Notification.create({
      userId,
      type,
      title,
      message,
      link: link || '',
    });
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};

// @desc    Get all notifications (Admin - for recent notifications list)
// @route   GET /api/v1/admin/notifications
// @access  Private (Admin)
export const getAllNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const sentNotifications = await SentNotification.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await SentNotification.countDocuments();

    const formattedNotifications = sentNotifications.map((notif: any) => ({
      id: notif._id.toString(),
      title: notif.title,
      message: notif.message,
      audience: notif.audience === 'all' ? 'All Users' : notif.recipientUser || 'Particular User',
      sentAt: notif.createdAt,
      sentBy: 'admin',
      status: 'sent'
    }));

    res.status(200).json({
      success: true,
      count: sentNotifications.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: formattedNotifications,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message,
    });
  }
};

// @desc    Send notification to all users or specific user (Admin)
// @route   POST /api/v1/admin/notifications/send
// @access  Private (Admin)
export const sendAdminNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { title, message, audience, recipientUser } = req.body;

    // Validation
    if (!title || !message || !audience) {
      return res.status(400).json({
        success: false,
        message: 'Title, message, and audience are required',
      });
    }

    if (audience === 'particular' && !recipientUser) {
      return res.status(400).json({
        success: false,
        message: 'Recipient user is required for particular user notifications',
      });
    }

    if (audience === 'all') {
      // Send to all users
      const allUsers = await User.find().select('_id').lean();
      
      // Create individual notifications for each user
      const notifications = allUsers.map((user) => ({
        userId: user._id,
        type: 'announcement',
        title,
        message,
        read: false,
      }));

      await Notification.insertMany(notifications);

      // Save sent notification record for admin view
      await SentNotification.create({
        title,
        message,
        audience: 'all',
        sentBy: req.user?._id,
      });

      return res.status(201).json({
        success: true,
        message: `Notification sent to ${allUsers.length} users`,
        data: {
          recipientCount: allUsers.length,
          title,
          message,
        },
      });
    } else if (audience === 'particular') {
      // Send to specific user
      const user = await User.findOne({
        $or: [
          { username: recipientUser },
          { email: recipientUser }
        ]
      }).select('_id username email');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      await Notification.create({
        userId: user._id,
        type: 'announcement',
        title,
        message,
        read: false,
      });

      // Save sent notification record for admin view
      await SentNotification.create({
        title,
        message,
        audience: 'particular',
        recipientUser,
        recipientUserId: user._id,
        sentBy: req.user?._id,
      });

      return res.status(201).json({
        success: true,
        message: 'Notification sent successfully',
        data: {
          recipientUser: recipientUser,
          title,
          message,
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to send notification',
      error: error.message,
    });
  }
};

// @desc    Update notification (Admin)
// @route   PUT /api/v1/admin/notifications/:id
// @access  Private (Admin)
export const updateAdminNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { title, message } = req.body;
    const { id } = req.params;

    // Validation
    if (!title && !message) {
      return res.status(400).json({
        success: false,
        message: 'At least title or message is required',
      });
    }

    const notification = await SentNotification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    // Update fields
    if (title) notification.title = title;
    if (message) notification.message = message;

    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification updated successfully',
      data: notification,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update notification',
      error: error.message,
    });
  }
};

// @desc    Delete notification (Admin)
// @route   DELETE /api/v1/admin/notifications/:id
// @access  Private (Admin)
export const deleteAdminNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const notification = await SentNotification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: err.message,
    });
  }
};

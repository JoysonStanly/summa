import { Request, Response } from 'express';
import User from '../models/User';

/**
 * @desc    Create initial admin user (only if no admin exists)
 * @route   POST /api/v1/auth/setup-admin
 * @access  Public (but only works once - when no admin exists)
 */
export const setupInitialAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password, setupSecret } = req.body;

    // Check setup secret from environment variable for security
    const expectedSecret = process.env.SETUP_SECRET || 'change-this-secret-key';
    
    if (!setupSecret || setupSecret !== expectedSecret) {
      return res.status(403).json({
        success: false,
        message: 'Invalid setup secret',
      });
    }

    // Check if any admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin user already exists. This endpoint can only be used for initial setup.',
      });
    }

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create admin user
    const adminUser = await User.create({
      name,
      email,
      password,
      role: 'admin',
      coins: 1000,
      preferences: {
        theme: 'dark',
        notifications: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

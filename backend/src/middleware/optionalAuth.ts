import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../types';

/**
 * Optional authentication - attaches user if token exists, but doesn't block if not
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in cookies or Authorization header
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token, just continue without user
    if (!token) {
      next();
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback-secret'
      ) as { id: string; role: string };

      // Get user from token
      const user = await User.findById(decoded.id);

      if (user) {
        // Attach user to request if found
        req.user = user as any;
      }

      next();
    } catch (error) {
      // Invalid token, but don't block - just continue without user
      next();
    }
  } catch (error: any) {
    console.error('Optional auth middleware error:', error);
    next(); // Continue even on error
  }
};

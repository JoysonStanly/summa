import { Request } from 'express';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'student' | 'instructor' | 'admin';
  avatar?: string;
  bio?: string;
  coins: number;
  completedProblems: string[];
  streakData: {
    currentStreak: number;
    maxStreak: number;
    lastActiveDate: Date;
  };
  preferences: {
    theme: 'dark' | 'light';
    notifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Extend Express Request type to include user
export interface AuthRequest extends Request {
  user?: IUser;
}

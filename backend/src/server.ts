import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/authRoutes';
import problemRoutes from './routes/problemRoutes';
import submissionRoutes from './routes/submissionRoutes';
import progressRoutes from './routes/progressRoutes';
import sessionRoutes from './routes/sessionRoutes';
import subjectRoutes from './routes/subjectRoutes';
import quizRoutes from './routes/quizRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import bugRoutes from './routes/bugRoutes';
import profileRoutes from './routes/profileRoutes';
import notificationRoutes from './routes/notificationRoutes';
import discussionRoutes from './routes/discussionRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import rankingsRoutes from './routes/rankingsRoutes';
import questionRoutes from './routes/questionRoutes';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app: Application = express();

// Trust proxy - important for deployment behind reverse proxies (Render, Heroku, etc.)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // Disable for development, configure properly for production
}));

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://studyio-frontend.onrender.com', // Render frontend
  'https://studyio.in', // Custom domain
  'https://www.studyio.in', // WWW variant
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting (disabled in development)
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
  });
  app.use('/api', limiter);
}

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser middleware
app.use(cookieParser());

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/problems', problemRoutes);
app.use('/api/v1/submissions', submissionRoutes);
app.use('/api/v1/progress', progressRoutes);
app.use('/api/v1/sessions', sessionRoutes);
app.use('/api/v1', subjectRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);
app.use('/api/v1/bugs', bugRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/discussions', discussionRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/rankings', rankingsRoutes);
app.use('/api/v1', questionRoutes);

// Health check route
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'StudyIO API is running',
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to StudyIO API',
    version: '2.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      problems: '/api/v1/problems',
      submissions: '/api/v1/submissions',
      progress: '/api/v1/progress',
      sessions: '/api/v1/sessions',
      subjects: '/api/v1/subjects',
      quizzes: '/api/v1/quizzes',
      leaderboard: '/api/v1/leaderboard',
      bugs: '/api/v1/bugs',
      profile: '/api/v1/profile',
      notifications: '/api/v1/notifications',
      discussions: '/api/v1/discussions',
      analytics: '/api/v1/analytics',
      rankings: '/api/v1/rankings',
      health: '/health',
    },
  });
});

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

export default app;

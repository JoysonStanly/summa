import { api } from './axiosClient';

export interface ProgressRecord {
  _id: string;
  userId: string;
  problemId: string;
  moduleId?: string;
  topicId?: string;
  completed: boolean;
  lastAttemptDate: string;
  attempts: number;
  timeSpent: number; // in seconds
  submissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProgressStats {
  totalProblems: number;
  completedProblems: number;
  attemptedProblems: number;
  completionRate: number;
}

export interface ProgressResponse {
  progress: ProgressRecord[];
  stats: ProgressStats;
}

export interface StreakData {
  currentStreak: number;
  maxStreak: number;
  dailyActivity: {
    _id: string; // date in YYYY-MM-DD format
    count: number;
  }[];
}

/**
 * Progress Service for tracking and retrieving user progress data
 */
const progressService = {
  /**
   * Get user progress for all problems
   */
  getUserProgress: async (userId: string): Promise<ProgressResponse> => {
    const response = await api.get(`/progress/user/${userId}`);
    return response.data.data;
  },

  /**
   * Get user progress for a specific module
   */
  getModuleProgress: async (userId: string, moduleId: string): Promise<ProgressResponse> => {
    const response = await api.get(`/progress/user/${userId}/module/${moduleId}`);
    return response.data.data;
  },

  /**
   * Get user progress for a specific topic
   */
  getTopicProgress: async (userId: string, topicId: string): Promise<ProgressResponse> => {
    const response = await api.get(`/progress/user/${userId}/topic/${topicId}`);
    return response.data.data;
  },

  /**
   * Update user progress for a problem
   */
  updateProgress: async (data: {
    userId: string;
    problemId: string;
    completed?: boolean;
    timeSpent?: number;
    submissionId?: string;
  }): Promise<ProgressRecord> => {
    const response = await api.post('/progress', data);
    return response.data.data;
  },

  /**
   * Get user streak data
   */
  getUserStreak: async (userId: string): Promise<StreakData> => {
    const response = await api.get(`/progress/streak/${userId}`);
    return response.data.data;
  }
};

export default progressService;
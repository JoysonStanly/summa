import api from '@/services/api/axiosClient';

export interface UserProgress {
  userId: string;
  problemsSolved: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
  streak: number;
  lastActiveDate: string;
  completedProblems: string[];
  skillLevel?: Record<string, number>;
}

export interface ProgressUpdate {
  problemId?: string;
  action: 'solved' | 'attempted' | 'streak';
  metadata?: any;
}

export interface ProgressStats {
  totalProblems: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  topicProgress: Record<string, number>;
  recentActivity: Array<{
    date: string;
    problemsSolved: number;
  }>;
}

export const progressService = {
  // Get user progress (protected)
  async getProgress(): Promise<UserProgress> {
    try {
      const response = await api.get<{ success: boolean; data: UserProgress }>('/progress');
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching progress:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch progress');
    }
  },

  // Update progress (protected)
  async updateProgress(update: ProgressUpdate): Promise<UserProgress> {
    try {
      const response = await api.post<{ success: boolean; data: UserProgress }>(
        '/progress',
        update
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating progress:', error);
      throw new Error(error.response?.data?.message || 'Failed to update progress');
    }
  },

  // Get progress statistics (protected)
  async getStats(): Promise<ProgressStats> {
    try {
      const response = await api.get<{ success: boolean; data: ProgressStats }>('/progress/stats');
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch stats');
    }
  },
};

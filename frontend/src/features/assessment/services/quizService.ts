import api from '@/services/api/axiosClient';

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: QuizQuestion[];
  timeLimit?: number;
  passingScore: number;
  createdBy: string;
  isActive: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  points: number;
}

export interface QuizSubmission {
  quizId: string;
  answers: Record<string, number>;
}

export interface QuizResult {
  _id: string;
  quizId: string;
  userId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  answers: Record<string, number>;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken?: number;
  passed: boolean;
  completedAt: string;
}

export const quizService = {
  // Get all quizzes
  async getQuizzes(category?: string): Promise<Quiz[]> {
    try {
      const response = await api.get<{ success: boolean; data: Quiz[] }>('/quizzes', {
        params: category ? { category } : {}
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching quizzes:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch quizzes');
    }
  },

  // Get single quiz
  async getQuiz(id: string): Promise<Quiz> {
    try {
      const response = await api.get<{ success: boolean; data: Quiz }>(`/quizzes/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching quiz:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch quiz');
    }
  },

  // Submit quiz answers (protected)
  async submitQuiz(id: string, answers: Record<string, number>): Promise<QuizResult> {
    try {
      const response = await api.post<{ success: boolean; data: QuizResult }>(
        `/quizzes/${id}/submit`,
        { answers }
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error submitting quiz:', error);
      throw new Error(error.response?.data?.message || 'Failed to submit quiz');
    }
  },

  // Get user's quiz results (protected)
  async getUserQuizResults(): Promise<QuizResult[]> {
    try {
      const response = await api.get<{ success: boolean; data: QuizResult[] }>('/quizzes/results');
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching quiz results:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch quiz results');
    }
  },

  // Create quiz (instructor/admin only)
  async createQuiz(quizData: Omit<Quiz, '_id' | 'createdBy'>): Promise<Quiz> {
    try {
      const response = await api.post<{ success: boolean; data: Quiz }>('/quizzes', quizData);
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating quiz:', error);
      throw new Error(error.response?.data?.message || 'Failed to create quiz');
    }
  },

  // Update quiz (instructor/admin only)
  async updateQuiz(id: string, quizData: Partial<Quiz>): Promise<Quiz> {
    try {
      const response = await api.put<{ success: boolean; data: Quiz }>(
        `/quizzes/${id}`,
        quizData
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating quiz:', error);
      throw new Error(error.response?.data?.message || 'Failed to update quiz');
    }
  },

  // Delete quiz (admin only)
  async deleteQuiz(id: string): Promise<void> {
    try {
      await api.delete(`/quizzes/${id}`);
    } catch (error: any) {
      console.error('Error deleting quiz:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete quiz');
    }
  },
};

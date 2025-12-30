import api from '@/services/api/axiosClient';

// Types
export interface Problem {
  _id: string;
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  subtopic?: string;
  description: string;
  examples?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints?: string[];
  starterCode?: Record<string, string>;
  testCases?: any[];
  companies?: string[];
  acceptance?: number;
  editorial?: any;
}

export interface ProblemFilters {
  difficulty?: string;
  topic?: string;
  subtopic?: string;
  search?: string;
  companies?: string;
}

export interface Submission {
  _id: string;
  problemId: string;
  userId: string;
  code: string;
  language: string;
  status: 'pending' | 'accepted' | 'rejected' | 'error';
  testResults?: any[];
  executionTime?: number;
  memory?: number;
  createdAt: string;
}

export interface SubmissionData {
  problemId: string;
  code: string;
  language: string;
}

// Problem Service using Axios
export const problemService = {
  // Get all problems with optional filters
  async getProblems(filters?: ProblemFilters): Promise<Problem[]> {
    try {
      const response = await api.get<{ success: boolean; data: Problem[] }>('/problems', {
        params: filters
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching problems:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch problems');
    }
  },

  // Get single problem by ID
  async getProblem(id: string): Promise<Problem> {
    try {
      const response = await api.get<{ success: boolean; data: Problem }>(`/problems/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching problem:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch problem');
    }
  },

  // Submit solution (protected route)
  async submitSolution(submissionData: SubmissionData): Promise<Submission> {
    try {
      const response = await api.post<{ success: boolean; data: Submission }>(
        '/submissions',
        submissionData
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error submitting solution:', error);
      throw new Error(error.response?.data?.message || 'Failed to submit solution');
    }
  },

  // Get user submissions (protected route)
  async getUserSubmissions(problemId?: string): Promise<Submission[]> {
    try {
      const response = await api.get<{ success: boolean; data: Submission[] }>('/submissions', {
        params: problemId ? { problemId } : {}
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch submissions');
    }
  },

  // Get submission details (protected route)
  async getSubmission(id: string): Promise<Submission> {
    try {
      const response = await api.get<{ success: boolean; data: Submission }>(`/submissions/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching submission:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch submission');
    }
  },

  // Admin: Create problem
  async createProblem(problemData: Partial<Problem>): Promise<Problem> {
    try {
      const response = await api.post<{ success: boolean; data: Problem }>(
        '/problems',
        problemData
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating problem:', error);
      throw new Error(error.response?.data?.message || 'Failed to create problem');
    }
  },

  // Admin: Update problem
  async updateProblem(id: string, problemData: Partial<Problem>): Promise<Problem> {
    try {
      const response = await api.put<{ success: boolean; data: Problem }>(
        `/problems/${id}`,
        problemData
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating problem:', error);
      throw new Error(error.response?.data?.message || 'Failed to update problem');
    }
  },

  // Admin: Delete problem
  async deleteProblem(id: string): Promise<void> {
    try {
      await api.delete(`/problems/${id}`);
    } catch (error: any) {
      console.error('Error deleting problem:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete problem');
    }
  },
};
import { api } from './axiosClient';

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  examples: ProblemExample[];
  constraints: string[];
  starterCode?: string;
  testCases: any[]; // The structure will depend on your backend implementation
  createdAt: string;
  updatedAt: string;
}

/**
 * Service for retrieving and managing problems
 */
const problemService = {
  /**
   * Get all problems
   */
  getAllProblems: async (): Promise<Problem[]> => {
    const response = await api.get('/problems');
    return response.data.data;
  },

  /**
   * Get problems by category
   */
  getProblemsByCategory: async (category: string): Promise<Problem[]> => {
    const response = await api.get(`/problems?category=${category}`);
    return response.data.data;
  },

  /**
   * Get a specific problem by ID
   */
  getProblemById: async (problemId: string): Promise<Problem> => {
    const response = await api.get(`/problems/${problemId}`);
    return response.data.data;
  },

  /**
   * Create a new problem (admin only)
   */
  createProblem: async (problemData: Omit<Problem, '_id' | 'createdAt' | 'updatedAt'>): Promise<Problem> => {
    const response = await api.post('/problems', problemData);
    return response.data.data;
  },

  /**
   * Update an existing problem (admin only)
   */
  updateProblem: async (problemId: string, problemData: Partial<Problem>): Promise<Problem> => {
    const response = await api.put(`/problems/${problemId}`, problemData);
    return response.data.data;
  },

  /**
   * Delete a problem (admin only)
   */
  deleteProblem: async (problemId: string): Promise<void> => {
    await api.delete(`/problems/${problemId}`);
  }
};

export default problemService;
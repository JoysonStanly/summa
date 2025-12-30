// Define types inline to avoid import issues
export type Difficulty = 'easy' | 'medium' | 'hard';
export type ProblemStatus = 'accepted' | 'rejected' | 'error' | 'timeout';

export interface Problem {
  _id: string;
  title: string;
  statement: string;
  difficulty: Difficulty;
  testCases: Array<{
    input: string;
    output: string;
  }>;
  hints?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  _id: string;
  title: string;
  description: string;
  modules: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  _id: string;
  title: string;
  subjectId: string;
  topics: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  _id: string;
  title: string;
  moduleId: string;
  contentType: 'video' | 'slides' | 'notes';
  contentLink: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionResult {
  status: ProblemStatus;
  runtime: string;
  memory: string;
  message?: string;
}

// Base API URL - using environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Helper for making API requests
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  // In a real implementation, you would add auth headers here
  const token = localStorage.getItem('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Helper for making API requests
const fetchApi = async (url: string, options: RequestInit = {}) => {
  // Get token if available
  const token = localStorage.getItem('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Problem-related API calls
export const problemsApi = {
  // Get all problems
  async getProblems(filters?: { difficulty?: string; tags?: string[]; category?: string }) {
    const queryParams = new URLSearchParams();
    
    if (filters?.difficulty) {
      queryParams.append('difficulty', filters.difficulty);
    }
    
    if (filters?.category) {
      queryParams.append('category', filters.category);
    }
    
    if (filters?.tags && filters.tags.length > 0) {
      queryParams.append('tags', filters.tags.join(','));
    }
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchApi(`/problems${query}`);
  },
  
  // Get a specific problem by ID
  async getProblem(id: string) {
    return fetchApi(`/problems/${id}`);
  },
  
  // Submit a solution
  async submitSolution(
    problemId: string, 
    code: string,
    language: string
  ): Promise<SubmissionResult> {
    return fetchApi('/submissions', {
      method: 'POST',
      body: JSON.stringify({ problemId, code, language }),
    });
  },
  
  // Get submission history
  async getSubmissions(problemId: string) {
    return fetchApi(`/submissions?problemId=${problemId}`);
  },
};

// Subject-related API calls
export const subjectsApi = {
  // Get all subjects
  async getSubjects() {
    return fetchApi('/subjects');
  },
  
  // Get a specific subject by ID
  async getSubject(id: string) {
    return fetchApi(`/subjects/${id}`);
  },
  
  // Get modules for a subject
  async getSubjectModules(subjectId: string) {
    return fetchApi(`/modules?subjectId=${subjectId}`);
  }
};

// Module-related API calls
export const modulesApi = {
  // Get a specific module
  async getModule(id: string) {
    return fetchApi(`/modules/${id}`);
  },
  
  // Get topics for a module
  async getModuleTopics(moduleId: string) {
    return fetchApi(`/topics?moduleId=${moduleId}`);
  }
};

// Topic-related API calls
export const topicsApi = {
  // Get a specific topic
  async getTopic(id: string) {
    return fetchApi(`/topics/${id}`);
  }
};

// User-related API calls
export const usersApi = {
  // Login - placeholder for future authentication
  async login(email: string, password: string) {
    return fetchApi('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  // Register - placeholder for future authentication
  async register(username: string, email: string, password: string) {
    return fetchApi('/users/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },
  
  // Get user profile
  async getProfile() {
    return fetchApi('/users/profile');
  },
  
  // Save user notes for a topic
  async saveNotes(topicId: string, notes: string) {
    return fetchApi('/users/notes', {
      method: 'POST',
      body: JSON.stringify({ topicId, notes }),
    });
  },
  
  // Get user progress
  async getProgress() {
    return fetchApi('/progress');
  }
};

// Quiz-related API calls
export const quizApi = {
  // Get all quizzes
  async getQuizzes() {
    return fetchApi('/quizzes');
  },
  
  // Get a specific quiz
  async getQuiz(id: string) {
    return fetchApi(`/quizzes/${id}`);
  },
  
  // Submit quiz results
  async submitQuizResults(quizId: string, answers: number[]) {
    return fetchApi('/quizzes/submissions', {
      method: 'POST',
      body: JSON.stringify({ 
        quizId, 
        answers 
      }),
    });
  },
  
  // Get quiz submissions history
  async getQuizSubmissions() {
    return fetchApi('/quizzes/submissions');
  }
};
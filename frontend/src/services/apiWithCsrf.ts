import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import csrfUtils from '../utils/csrfUtils';

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

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies (including CSRF)
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for auth token
axiosInstance.interceptors.request.use(async (config) => {
  // Get auth token if available
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // For non-GET methods, add CSRF token
  if (config.method !== 'get') {
    // Apply the CSRF token only to the headers
    try {
      const token = await csrfUtils.getCsrfToken();
      config.headers['X-CSRF-Token'] = token;
    } catch (error) {
      console.error('Failed to add CSRF token:', error);
    }
  }
  
  return config;
});

// Helper for making API requests
const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Extract error message from response if available
      const errorMessage = error.response.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw error;
  }
};

// Problem-related API calls
export const problemsApi = {
  // Get all problems
  async getProblems(filters?: { difficulty?: string; tags?: string[] }) {
    const params: Record<string, string> = {};
    
    if (filters?.difficulty) {
      params.difficulty = filters.difficulty;
    }
    
    if (filters?.tags && filters.tags.length > 0) {
      params.tags = filters.tags.join(',');
    }
    
    return apiRequest<{ data: Problem[] }>({
      method: 'GET',
      url: '/problems',
      params
    });
  },
  
  // Get a specific problem by ID
  async getProblem(id: string) {
    return apiRequest<{ data: Problem }>({
      method: 'GET',
      url: `/problems/${id}`
    });
  },
  
  // Submit a solution
  async submitSolution(
    problemId: string, 
    code: string,
    language: string
  ): Promise<SubmissionResult> {
    return apiRequest<SubmissionResult>({
      method: 'POST',
      url: '/submissions',
      data: { problemId, code, language }
    });
  },
};

// Subject-related API calls
export const subjectsApi = {
  // Get all subjects
  async getSubjects() {
    return apiRequest<{ data: Subject[] }>({
      method: 'GET',
      url: '/subjects'
    });
  },
  
  // Get a specific subject by ID
  async getSubject(id: string) {
    return apiRequest<{ data: Subject }>({
      method: 'GET',
      url: `/subjects/${id}`
    });
  }
};

// Module-related API calls
export const modulesApi = {
  // Get all modules for a subject
  async getModulesBySubject(subjectId: string) {
    return apiRequest<{ data: Module[] }>({
      method: 'GET',
      url: `/subjects/${subjectId}/modules`
    });
  },
  
  // Get a specific module by ID
  async getModule(id: string) {
    return apiRequest<{ data: Module }>({
      method: 'GET',
      url: `/modules/${id}`
    });
  }
};

// Topic-related API calls
export const topicsApi = {
  // Get all topics for a module
  async getTopicsByModule(moduleId: string) {
    return apiRequest<{ data: Topic[] }>({
      method: 'GET',
      url: `/modules/${moduleId}/topics`
    });
  },
  
  // Get a specific topic by ID
  async getTopic(id: string) {
    return apiRequest<{ data: Topic }>({
      method: 'GET',
      url: `/topics/${id}`
    });
  }
};

// Authentication-related API calls
export const authApi = {
  // Register a new user
  async register(name: string, email: string, password: string) {
    return apiRequest({
      method: 'POST',
      url: '/auth/register',
      data: { name, email, password }
    });
  },
  
  // Login user
  async login(email: string, password: string) {
    interface LoginResponse {
      success: boolean;
      token: string;
      data: {
        _id: string;
        name: string;
        email: string;
        role: string;
        progress: string[];
        streak: number;
        createdAt: string;
        updatedAt: string;
      };
    }
    
    const response = await apiRequest<LoginResponse>({
      method: 'POST',
      url: '/auth/login',
      data: { email, password }
    });
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  },
  
  // Logout user
  async logout() {
    const response = await apiRequest({
      method: 'GET',
      url: '/auth/logout'
    });
    
    // Remove token from localStorage
    localStorage.removeItem('auth_token');
    
    return response;
  },
  
  // Get current user
  async getCurrentUser() {
    return apiRequest({
      method: 'GET',
      url: '/auth/me'
    });
  }
};

export default {
  problems: problemsApi,
  subjects: subjectsApi,
  modules: modulesApi,
  topics: topicsApi,
  auth: authApi
};
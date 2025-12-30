import api from '@/services/api/axiosClient';

// Types for authentication
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  data: User;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role?: 'student' | 'instructor' | 'admin';
}

// Auth API service using Axios
export const authApi = {
  // Register a new user
  async register(userData: RegisterData): Promise<User> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', userData);
      return response.data.data;
    } catch (error: any) {
      // Axios error handling
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map((err: any) => err.message).join(', ');
        throw new Error(errorMessages);
      }
      throw new Error('Registration failed');
    }
  },

  // Login user
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map((err: any) => err.message).join(', ');
        throw new Error(errorMessages);
      }
      throw new Error('Login failed');
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Get current user (validate session)
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<AuthResponse>('/auth/me');
      return response.data.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
};
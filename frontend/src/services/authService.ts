// Types for authentication
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  token: string;
  data: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role?: 'student' | 'instructor' | 'admin';
}

// Base API URL - using environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Auth API service
export const authApi = {
  // Register a new user
  async register(userData: RegisterData): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Handle different error formats from backend
      if (errorData.errors && Array.isArray(errorData.errors)) {
        // Validation errors from express-validator
        const validationMessages = errorData.errors.map((err: { field: string; message: string }) => err.message).join(', ');
        throw new Error(validationMessages);
      } else if (errorData.message) {
        // Standard error message
        throw new Error(errorData.message);
      } else {
        throw new Error('Registration failed');
      }
    }

    const data: AuthResponse = await response.json();
    
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    
    // Store user data in localStorage
    if (data.data) {
      localStorage.setItem('user', JSON.stringify(data.data));
    }
    
    return data.data;
  },

  // Login user
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Handle different error formats from backend
      if (errorData.errors && Array.isArray(errorData.errors)) {
        // Validation errors from express-validator
        const validationMessages = errorData.errors.map((err: { field: string; message: string }) => err.message).join(', ');
        throw new Error(validationMessages);
      } else if (errorData.message) {
        // Standard error message
        throw new Error(errorData.message);
      } else {
        throw new Error('Login failed');
      }
    }

    const data: AuthResponse = await response.json();
    
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    
    // Store user data in localStorage
    if (data.data) {
      localStorage.setItem('user', JSON.stringify(data.data));
    }
    
    return data.data;
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'GET',
        credentials: 'include', // Include cookies
      });
    } finally {
      // Clean up local storage even if API call fails
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  // Get current user from token
  async getCurrentUser(): Promise<User | null> {
    // First try to get from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    
    // If no user in localStorage, try to get from API
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return null;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include', // Include cookies
      });
      
      if (!response.ok) {
        throw new Error('Failed to get current user');
      }
      
      const { data } = await response.json();
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
  
  // Check if user is logged in
  isAuthenticated(): boolean {
    return localStorage.getItem('auth_token') !== null;
  },
  
  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
};
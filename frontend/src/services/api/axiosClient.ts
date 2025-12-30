import axios from 'axios';

// Base API URL - using environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create an axios instance with custom config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CRITICAL: Enable cookies for cookie-based authentication
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.status}`, response.data);
    }
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response?.status === 401) {
      // Unauthorized - redirect to login
      console.error('[API] Unauthorized - redirecting to login');
      window.location.href = '/login';
    } else if (response?.status === 403) {
      console.error('[API] Forbidden - insufficient permissions');
    } else if (response?.status === 404) {
      console.error('[API] Resource not found');
    } else if (response?.status >= 500) {
      console.error('[API] Server error', response.data);
    }
    
    return Promise.reject(error);
  }
);

export default api;
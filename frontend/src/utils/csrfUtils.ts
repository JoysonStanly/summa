/**
 * CSRF protection utilities for the frontend
 */

import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for CSRF cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Store CSRF token in memory
let csrfToken: string | null = null;

/**
 * Fetch a CSRF token from the server
 * @returns Promise resolving to the CSRF token
 */
export const fetchCsrfToken = async (): Promise<string> => {
  try {
    const response = await apiClient.get('/csrf-token');
    if (response.data && response.data.csrfToken) {
      csrfToken = response.data.csrfToken;
      return csrfToken as string;
    }
    throw new Error('Invalid CSRF token response');
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    throw new Error('Failed to fetch CSRF token');
  }
};

/**
 * Get the current CSRF token, fetching a new one if needed
 * @returns Promise resolving to the CSRF token
 */
export const getCsrfToken = async (): Promise<string> => {
  if (!csrfToken) {
    return fetchCsrfToken();
  }
  return csrfToken;
};

/**
 * Add the CSRF token to an API request config
 * @param config Axios request config
 * @returns Modified axios config with CSRF header
 */
export const addCsrfHeader = async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
  const token = await getCsrfToken();
  return {
    ...config,
    headers: {
      ...config.headers,
      'X-CSRF-Token': token,
    },
  };
};

// Export default object with all functions
const csrfUtils = {
  fetchCsrfToken,
  getCsrfToken,
  addCsrfHeader,
};

export default csrfUtils;
// API helpers
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Helper for making API requests
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
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

export interface Problem {
  _id: string;
  title: string;
  slug: string;
  isCompleted?: boolean;
  isBookmarked?: boolean;
}

export interface Topic {
  _id: string;
  title: string;
  slug: string;
  problems?: Problem[];
  subTopics?: Topic[];
}

// DSA topics API service
export const dsaApi = {
  // Get all DSA topics with problems
  async getTopics(): Promise<Topic[]> {
    try {
      const response = await fetchWithAuth('/subjects?category=dsa');
      
      // Transform the response to match our frontend structure
      if (response && Array.isArray(response)) {
        return response.map(subject => ({
          _id: subject._id,
          title: subject.title,
          slug: subject.title.toLowerCase().replace(/\s+/g, '-'),
          problems: [],  // Initially empty, to be populated by getTopicProblems if needed
          subTopics: []  // Initially empty, to be populated by getSubTopics if needed
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Failed to fetch DSA topics:', error);
      return [];
    }
  },
  
  // Get problems for a specific topic
  async getTopicProblems(topicId: string): Promise<Problem[]> {
    try {
      const response = await fetchWithAuth(`/problems?topic=${topicId}`);
      
      // Transform the response to match our frontend structure
      if (response && Array.isArray(response)) {
        return response.map(problem => ({
          _id: problem._id,
          title: problem.title,
          slug: problem.title.toLowerCase().replace(/\s+/g, '-'),
          isCompleted: false,  // Default values, to be updated from user progress
          isBookmarked: false  // Default values, to be updated from user bookmarks
        }));
      }
      
      return [];
    } catch (error) {
      console.error(`Failed to fetch problems for topic ${topicId}:`, error);
      return [];
    }
  },
  
  // Get sub-topics for a specific topic
  async getSubTopics(topicId: string): Promise<Topic[]> {
    try {
      const response = await fetchWithAuth(`/modules?subject=${topicId}`);
      
      // Transform the response to match our frontend structure
      if (response && Array.isArray(response)) {
        return response.map(module => ({
          _id: module._id,
          title: module.title,
          slug: module.title.toLowerCase().replace(/\s+/g, '-'),
          problems: []  // Initially empty, to be populated if needed
        }));
      }
      
      return [];
    } catch (error) {
      console.error(`Failed to fetch sub-topics for topic ${topicId}:`, error);
      return [];
    }
  },
  
  // Check user progress and update problem completion status
  async updateProblemProgress(problems: Problem[]): Promise<Problem[]> {
    try {
      // Get user progress from the backend
      const userId = localStorage.getItem('userId');
      if (!userId) return problems;
      
      const progress = await fetchWithAuth(`/users/${userId}/progress`);
      
      // Map of completed problem IDs for quick lookup
      const completedProblems = new Set(progress.completedProblems || []);
      const bookmarkedProblems = new Set(progress.bookmarkedProblems || []);
      
      // Update completion status
      return problems.map(problem => ({
        ...problem,
        isCompleted: completedProblems.has(problem._id),
        isBookmarked: bookmarkedProblems.has(problem._id)
      }));
    } catch (error) {
      console.error('Failed to update problem progress:', error);
      return problems;
    }
  }
};
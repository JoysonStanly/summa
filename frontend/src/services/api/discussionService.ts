import api from './axiosClient';

export interface DiscussionComment {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  content: string;
  likes: string[];
  replies: string[];
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Discussion {
  _id: string;
  problemId: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  title?: string;
  content: string;
  category: 'question' | 'solution' | 'discussion';
  tags: string[];
  likes: string[];
  comments: DiscussionComment[];
  views: number;
  isSolved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiscussionData {
  problemId: string;
  title: string;
  content: string;
  category?: 'question' | 'solution' | 'discussion';
  tags?: string[];
}

export interface CreateCommentData {
  content: string;
}

// Get all discussions for a problem
export const getProblemDiscussions = async (
  problemId: string,
  params?: {
    category?: 'question' | 'solution' | 'discussion';
    sortBy?: 'recent' | 'popular' | 'solved';
  }
) => {
  const response = await api.get(`/discussions/problem/${problemId}`, { params });
  return response.data;
};

// Get a single discussion
export const getDiscussion = async (discussionId: string) => {
  const response = await api.get(`/discussions/${discussionId}`);
  return response.data;
};

// Create a new discussion
export const createDiscussion = async (data: CreateDiscussionData) => {
  const response = await api.post('/discussions', data);
  return response.data;
};

// Update a discussion
export const updateDiscussion = async (discussionId: string, data: Partial<CreateDiscussionData>) => {
  const response = await api.put(`/discussions/${discussionId}`, data);
  return response.data;
};

// Delete a discussion
export const deleteDiscussion = async (discussionId: string) => {
  const response = await api.delete(`/discussions/${discussionId}`);
  return response.data;
};

// Toggle like on a discussion
export const toggleLike = async (discussionId: string) => {
  const response = await api.post(`/discussions/${discussionId}/like`);
  return response.data;
};

// Add a comment to a discussion
export const addComment = async (discussionId: string, data: CreateCommentData) => {
  const response = await api.post(`/discussions/${discussionId}/comments`, data);
  return response.data;
};

// Get user's discussions
export const getUserDiscussions = async (userId: string) => {
  const response = await api.get(`/discussions/user/${userId}`);
  return response.data;
};

export default {
  getProblemDiscussions,
  getDiscussion,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  toggleLike,
  addComment,
  getUserDiscussions,
};

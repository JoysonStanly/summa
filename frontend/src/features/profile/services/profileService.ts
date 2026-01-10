import api from '@shared/api/axiosClient';

// Profile data interfaces
export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
  resume?: string;
}

export interface Project {
  name: string;
  description?: string;
  url?: string;
  credentials?: {
    username: string;
    password: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  countryCode?: string;
  location?: string;
  university?: string;
  educationYear?: string;
  bio?: string;
  avatar?: string;
  skills: string[];
  socialLinks: SocialLinks;
  projects: Project[];
  role: 'student' | 'instructor' | 'admin';
  coins: number;
  streakData: {
    currentStreak: number;
    maxStreak: number;
    lastActiveDate: string | null;
  };
  createdAt: string;
}

export interface ProfileStats {
  problemsSolved: number;
  totalAttempts: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
  accuracy: string;
  totalTimeSpent: number;
  currentStreak: number;
  maxStreak: number;
}

export interface ProfileActivity {
  recentSubmissions: Array<{
    _id: string;
    problemId: {
      _id: string;
      title: string;
      slug: string;
      difficulty: string;
    };
    status: string;
    createdAt: string;
  }>;
  activityHeatmap: Record<string, number>;
}

export interface ProfileResponse {
  success: boolean;
  data: {
    user: UserProfile;
    stats: ProfileStats;
  };
}

export interface ProfileUpdateData {
  name?: string;
  mobile?: string;
  countryCode?: string;
  location?: string;
  university?: string;
  educationYear?: string;
  bio?: string;
  avatar?: string;
  skills?: string[];
  socialLinks?: SocialLinks;
  projects?: Project[];
}

// Helper to extract error message
const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return axiosError.response?.data?.message || 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An error occurred';
};

export const profileService = {
  // Get current user's full profile
  async getMyProfile(): Promise<{ user: UserProfile; stats: ProfileStats }> {
    try {
      const response = await api.get<ProfileResponse>('/profile/me');
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error fetching profile:', error);
      throw new Error(getErrorMessage(error) || 'Failed to fetch profile');
    }
  },

  // Get user profile by ID
  async getProfileById(userId: string): Promise<{ user: UserProfile; stats: ProfileStats }> {
    try {
      const response = await api.get<ProfileResponse>(`/profile/${userId}`);
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error fetching profile:', error);
      throw new Error(getErrorMessage(error) || 'Failed to fetch profile');
    }
  },

  // Get user profile by username/name
  async getProfileByUsername(username: string): Promise<{ user: UserProfile; stats: ProfileStats }> {
    try {
      const response = await api.get<ProfileResponse>(`/profile/user/${encodeURIComponent(username)}`);
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error fetching profile:', error);
      throw new Error(getErrorMessage(error) || 'Failed to fetch profile');
    }
  },

  // Update current user's profile
  async updateProfile(data: ProfileUpdateData): Promise<UserProfile> {
    try {
      const response = await api.put<{ success: boolean; data: UserProfile }>('/profile', data);
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error updating profile:', error);
      throw new Error(getErrorMessage(error) || 'Failed to update profile');
    }
  },

  // Get user activity (heatmap, recent submissions)
  async getActivity(userId: string): Promise<ProfileActivity> {
    try {
      const response = await api.get<{ success: boolean; data: ProfileActivity }>(`/profile/activity/${userId}`);
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error fetching activity:', error);
      throw new Error(getErrorMessage(error) || 'Failed to fetch activity');
    }
  },

  // Get my activity
  async getMyActivity(): Promise<ProfileActivity> {
    try {
      const response = await api.get<{ success: boolean; data: ProfileActivity }>('/profile/activity/me');
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error fetching activity:', error);
      throw new Error(getErrorMessage(error) || 'Failed to fetch activity');
    }
  },
};

import api from '@shared/api/axiosClient';

export type UserRole = 'student' | 'instructor' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'pending';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
  avatar?: string;
  bio?: string;
  mobile?: string;
  location?: string;
  university?: string;
  coins?: number;
  completedProblems?: string[];
  streakData?: {
    currentStreak: number;
    maxStreak: number;
    lastActiveDate: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

export interface UserFilters {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  bio?: string;
  mobile?: string;
  location?: string;
  university?: string;
}

export const userService = {
  // Get all users (admin only)
  async getAllUsers(filters?: UserFilters): Promise<User[]> {
    const params = new URLSearchParams();
    
    if (filters?.role) params.append('role', filters.role);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const url = `/auth/users${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get<ApiResponse<User[]>>(url);
    return response.data.data;
  },

  // Get single user by ID
  async getUser(userId: string): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`/profile/${userId}`);
    return response.data.data;
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  // Update user (admin only)
  async updateUser(userId: string, payload: UpdateUserPayload): Promise<User> {
    const response = await api.put<ApiResponse<User>>(`/auth/users/${userId}`, payload);
    return response.data.data;
  },

  // Delete user (admin only)
  async deleteUser(userId: string): Promise<void> {
    await api.delete(`/auth/users/${userId}`);
  },

  // Get user statistics
  async getUserStats(): Promise<{
    total: number;
    active: number;
    suspended: number;
    pending: number;
    byRole: Record<UserRole, number>;
  }> {
    const response = await api.get<ApiResponse<any>>('/auth/users/stats');
    return response.data.data;
  },
};

export default userService;

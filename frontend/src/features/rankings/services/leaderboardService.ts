import api from '@/services/api/axiosClient';
import { apiCache } from '@/utils/apiCache';

// Types for leaderboard
export interface LeaderboardUser {
  rank: number;
  userId: string;
  name: string;
  email: string;
  coins: number;
  currentStreak: number;
  maxStreak: number;
  problemsSolved: number;
}

export interface LeaderboardResponse {
  success: boolean;
  count: number;
  total: number;
  data: LeaderboardUser[];
}

export interface UserRankResponse {
  success: boolean;
  data: LeaderboardUser;
}

export interface TopPerformersResponse {
  success: boolean;
  data: {
    topByCoins: Array<{ rank: number; name: string; coins: number }>;
    topByStreak: Array<{ rank: number; name: string; streak: number }>;
    topByProblems: Array<{ rank: number; name: string; problemsSolved: number }>;
  };
}

// Leaderboard API service
export const leaderboardApi = {
  // Get leaderboard with pagination and caching
  async getLeaderboard(limit: number = 10, skip: number = 0, forceRefresh = false): Promise<LeaderboardResponse> {
    const cacheKey = `leaderboard_${limit}_${skip}`;
    
    try {
      return await apiCache.fetchWithCache(
        { key: cacheKey, ttl: 2 * 60 * 1000, forceRefresh }, // 2 minutes cache
        async () => {
          const response = await api.get<LeaderboardResponse>('/leaderboard', {
            params: { limit, skip }
          });
          return response.data;
        }
      );
    } catch (error: unknown) {
      // Try to use cached data on error
      const cached = apiCache.get<LeaderboardResponse>(cacheKey);
      if (cached) {
        console.warn('Using cached leaderboard data due to API error');
        return cached;
      }
      
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          throw new Error(axiosError.response.data.message);
        }
      }
      throw new Error('Failed to fetch leaderboard');
    }
  },

  // Get user rank by userId
  async getUserRank(userId: string): Promise<UserRankResponse> {
    try {
      const response = await api.get<UserRankResponse>(`/leaderboard/rank/${userId}`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          throw new Error(axiosError.response.data.message);
        }
      }
      throw new Error('Failed to fetch user rank');
    }
  },

  // Get top performers
  async getTopPerformers(): Promise<TopPerformersResponse> {
    try {
      const response = await api.get<TopPerformersResponse>('/leaderboard/top');
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          throw new Error(axiosError.response.data.message);
        }
      }
      throw new Error('Failed to fetch top performers');
    }
  }
};

export default leaderboardApi;

// Re-export types explicitly
export type { LeaderboardUser, LeaderboardResponse, UserRankResponse, TopPerformersResponse };

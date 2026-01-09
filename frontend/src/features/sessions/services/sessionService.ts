import api from '@/services/api/axiosClient';
import { apiCache } from '@/utils/apiCache';

const getErrorMessage = (error: unknown, fallback: string) => {
  const maybeAxiosError = error as { response?: { data?: { message?: string } } };
  return (
    maybeAxiosError?.response?.data?.message ||
    (error instanceof Error ? error.message : fallback)
  );
};

export interface Session {
  _id: string;
  id?: string;
  title: string;
  date: string;
  timeRange?: string;
  meetLink?: string;
  meetingLink?: string;
  thumbnailUrl?: string;
  videoRecordingUrl?: string;
  isLive?: boolean;
  maxParticipants?: number;
  participants?: string[]; // backend field
  enrolledUsers?: string[]; // legacy/compat
  tags?: string[];
}

export interface CreateSessionData {
  title: string;
  date: string;
  timeRange: string;
  duration: number;
  meetLink: string;
  description?: string;
  category?: string;
  thumbnailUrl?: string;
  videoRecordingUrl?: string;
  maxParticipants?: number;
  tags?: string[];
  isLive?: boolean;
}

export const sessionService = {
  // Get all sessions with caching
  async getSessions(filter?: 'upcoming' | 'past', forceRefresh = false): Promise<Session[]> {
    const cacheKey = `sessions_${filter || 'all'}`;
    
    try {
      return await apiCache.fetchWithCache(
        { key: cacheKey, ttl: 3 * 60 * 1000, forceRefresh }, // 3 minutes cache
        async () => {
          const response = await api.get<{ success: boolean; data: Session[] }>('/sessions', {
            params: filter ? { status: filter } : {}
          });
          return response.data.data;
        }
      );
    } catch (error: unknown) {
      console.error('Error fetching sessions:', error);
      // Return cached data if available, otherwise throw
      const cached = apiCache.get<Session[]>(cacheKey);
      if (cached) {
        console.warn('Using cached sessions data due to API error');
        return cached;
      }
      throw new Error(getErrorMessage(error, 'Failed to fetch sessions'));
    }
  },

  // Get single session
  async getSession(id: string): Promise<Session> {
    try {
      const response = await api.get<{ success: boolean; data: Session }>(`/sessions/${id}`);
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error fetching session:', error);
      throw new Error(getErrorMessage(error, 'Failed to fetch session'));
    }
  },

  // Create session (instructor/admin only)
  async createSession(sessionData: CreateSessionData): Promise<Session> {
    try {
      const response = await api.post<{ success: boolean; data: Session }>(
        '/sessions',
        sessionData
      );
      // Invalidate all session caches after creating
      apiCache.delete('sessions_all');
      apiCache.delete('sessions_upcoming');
      apiCache.delete('sessions_past');
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error creating session:', error);
      throw new Error(getErrorMessage(error, 'Failed to create session'));
    }
  },

  // Update session (instructor/admin only)
  async updateSession(id: string, sessionData: Partial<CreateSessionData>): Promise<Session> {
    try {
      const response = await api.put<{ success: boolean; data: Session }>(
        `/sessions/${id}`,
        sessionData
      );
      // Invalidate all session caches after updating
      apiCache.delete('sessions_all');
      apiCache.delete('sessions_upcoming');
      apiCache.delete('sessions_past');
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error updating session:', error);
      throw new Error(getErrorMessage(error, 'Failed to update session'));
    }
  },

  // Delete session (instructor/admin only)
  async deleteSession(id: string): Promise<void> {
    try {
      await api.delete(`/sessions/${id}`);
      // Invalidate all session caches after deleting
      apiCache.delete('sessions_all');
      apiCache.delete('sessions_upcoming');
      apiCache.delete('sessions_past');
    } catch (error: unknown) {
      console.error('Error deleting session:', error);
      throw new Error(getErrorMessage(error, 'Failed to delete session'));
    }
  },

  // Enroll in session (protected)
  async enrollInSession(id: string): Promise<Session> {
    try {
      const response = await api.post<{ success: boolean; data: Session }>(
        `/sessions/${id}/register`
      );
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error enrolling in session:', error);
      throw new Error(getErrorMessage(error, 'Failed to enroll in session'));
    }
  },

  // Check if user is registered
  async checkRegistration(id: string): Promise<boolean> {
    try {
      const response = await api.get<{ success: boolean; data: { registered: boolean } }>(
        `/sessions/${id}/is-registered`
      );
      return response.data.data.registered;
    } catch (error: unknown) {
      console.error('Error checking registration:', error);
      return false;
    }
  },
};

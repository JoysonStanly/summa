import api from '@/services/api/axiosClient';

export interface Session {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  date: string;
  startTime: string;
  endTime: string;
  meetingLink?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  maxParticipants?: number;
  enrolledUsers?: string[];
  tags?: string[];
}

export interface CreateSessionData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  meetingLink?: string;
  maxParticipants?: number;
  tags?: string[];
}

export const sessionService = {
  // Get all sessions
  async getSessions(filter?: 'upcoming' | 'past'): Promise<Session[]> {
    try {
      const response = await api.get<{ success: boolean; data: Session[] }>('/sessions', {
        params: filter ? { status: filter } : {}
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching sessions:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch sessions');
    }
  },

  // Get single session
  async getSession(id: string): Promise<Session> {
    try {
      const response = await api.get<{ success: boolean; data: Session }>(`/sessions/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching session:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch session');
    }
  },

  // Create session (instructor/admin only)
  async createSession(sessionData: CreateSessionData): Promise<Session> {
    try {
      const response = await api.post<{ success: boolean; data: Session }>(
        '/sessions',
        sessionData
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating session:', error);
      throw new Error(error.response?.data?.message || 'Failed to create session');
    }
  },

  // Update session (instructor/admin only)
  async updateSession(id: string, sessionData: Partial<CreateSessionData>): Promise<Session> {
    try {
      const response = await api.put<{ success: boolean; data: Session }>(
        `/sessions/${id}`,
        sessionData
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating session:', error);
      throw new Error(error.response?.data?.message || 'Failed to update session');
    }
  },

  // Delete session (instructor/admin only)
  async deleteSession(id: string): Promise<void> {
    try {
      await api.delete(`/sessions/${id}`);
    } catch (error: any) {
      console.error('Error deleting session:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete session');
    }
  },

  // Enroll in session (protected)
  async enrollInSession(id: string): Promise<Session> {
    try {
      const response = await api.post<{ success: boolean; data: Session }>(
        `/sessions/${id}/enroll`
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error enrolling in session:', error);
      throw new Error(error.response?.data?.message || 'Failed to enroll in session');
    }
  },
};

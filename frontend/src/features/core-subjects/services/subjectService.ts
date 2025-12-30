import api from '@/services/api/axiosClient';

export interface Subject {
  _id: string;
  name: string;
  code: string;
  description: string;
  icon?: string;
  modules: Module[];
}

export interface Module {
  _id: string;
  title: string;
  description: string;
  order: number;
  topics: Topic[];
}

export interface Topic {
  _id: string;
  title: string;
  content: string;
  order: number;
  examples?: any[];
  resources?: Resource[];
}

export interface Resource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'documentation' | 'other';
}

export const subjectService = {
  // Get all subjects
  async getSubjects(): Promise<Subject[]> {
    try {
      const response = await api.get<{ success: boolean; data: Subject[] }>('/subjects');
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching subjects:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch subjects');
    }
  },

  // Get single subject by ID
  async getSubject(id: string): Promise<Subject> {
    try {
      const response = await api.get<{ success: boolean; data: Subject }>(`/subjects/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching subject:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch subject');
    }
  },

  // Get subject by code (e.g., 'os', 'dbms')
  async getSubjectByCode(code: string): Promise<Subject> {
    try {
      const response = await api.get<{ success: boolean; data: Subject }>(`/subjects/code/${code}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching subject by code:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch subject');
    }
  },

  // Get specific module
  async getModule(subjectId: string, moduleId: string): Promise<Module> {
    try {
      const response = await api.get<{ success: boolean; data: Module }>(
        `/subjects/${subjectId}/modules/${moduleId}`
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching module:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch module');
    }
  },

  // Get specific topic
  async getTopic(subjectId: string, moduleId: string, topicId: string): Promise<Topic> {
    try {
      const response = await api.get<{ success: boolean; data: Topic }>(
        `/subjects/${subjectId}/modules/${moduleId}/topics/${topicId}`
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching topic:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch topic');
    }
  },

  // Admin: Create subject
  async createSubject(subjectData: Omit<Subject, '_id' | 'modules'>): Promise<Subject> {
    try {
      const response = await api.post<{ success: boolean; data: Subject }>(
        '/subjects',
        subjectData
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating subject:', error);
      throw new Error(error.response?.data?.message || 'Failed to create subject');
    }
  },

  // Admin: Update subject
  async updateSubject(id: string, subjectData: Partial<Subject>): Promise<Subject> {
    try {
      const response = await api.put<{ success: boolean; data: Subject }>(
        `/subjects/${id}`,
        subjectData
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating subject:', error);
      throw new Error(error.response?.data?.message || 'Failed to update subject');
    }
  },
};

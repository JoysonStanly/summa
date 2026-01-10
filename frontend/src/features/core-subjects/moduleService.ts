import { api } from '@shared/api/axiosClient';

export interface Module {
  _id: string;
  title: string;
  subjectId: string;
  description?: string;
  order?: number;
  topics: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  _id: string;
  title: string;
  moduleId: string;
  description?: string;
  contentType: 'video' | 'slides' | 'notes';
  contentLink: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

const moduleService = {
  /**
   * Get all modules
   */
  getAllModules: async (): Promise<Module[]> => {
    const response = await api.get('/modules');
    return response.data.data;
  },
  
  /**
   * Get a specific module by ID
   */
  getModule: async (id: string): Promise<Module> => {
    const response = await api.get(`/modules/${id}`);
    return response.data.data;
  },
  
  /**
   * Get modules for a specific subject
   */
  getSubjectModules: async (subjectId: string): Promise<Module[]> => {
    const response = await api.get(`/modules?subjectId=${subjectId}`);
    return response.data.data;
  },
  
  /**
   * Get topics for a specific module
   */
  getModuleTopics: async (moduleId: string): Promise<Topic[]> => {
    const response = await api.get(`/topics?moduleId=${moduleId}`);
    return response.data.data;
  },
  
  /**
   * Get a specific topic by ID
   */
  getTopic: async (id: string): Promise<Topic> => {
    const response = await api.get(`/topics/${id}`);
    return response.data.data;
  }
};

export default moduleService;
import api from './axiosClient';

export type BugStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type BugPriority = 'low' | 'medium' | 'high' | 'critical';

export interface BugReporter {
  _id: string;
  name?: string;
  email?: string;
}

export interface BugProblemRef {
  _id: string;
  title?: string;
  slug?: string;
}

export interface BugReport {
  _id: string;
  title: string;
  description: string;
  status: BugStatus;
  priority: BugPriority;
  category: string;
  reportedBy: BugReporter | string;
  assignedTo?: BugReporter | string;
  problemId?: BugProblemRef;
  screenshots?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface BugFilters {
  status?: BugStatus;
  priority?: BugPriority;
  reportedBy?: string;
}

export interface CreateBugPayload {
  title: string;
  description: string;
  priority: BugPriority;
  category: string;
  problemId?: string;
  screenshots?: string[];
}

export interface UpdateBugPayload {
  title?: string;
  description?: string;
  status?: BugStatus;
  priority?: BugPriority;
  category?: string;
  problemId?: string;
  assignedTo?: string;
  screenshots?: string[];
}

export const bugService = {
  async getBugReports(filters?: BugFilters): Promise<BugReport[]> {
    const response = await api.get<ApiResponse<BugReport[]>>('/bugs', { params: filters });
    return response.data.data;
  },

  async getBugReport(id: string): Promise<BugReport> {
    const response = await api.get<ApiResponse<BugReport>>(`/bugs/${id}`);
    return response.data.data;
  },

  async getMyBugReports(): Promise<BugReport[]> {
    const response = await api.get<ApiResponse<BugReport[]>>('/bugs/my-bugs');
    return response.data.data;
  },

  async createBugReport(payload: CreateBugPayload): Promise<BugReport> {
    const response = await api.post<ApiResponse<BugReport>>('/bugs', payload);
    return response.data.data;
  },

  async updateBugReport(id: string, payload: UpdateBugPayload): Promise<BugReport> {
    const response = await api.put<ApiResponse<BugReport>>(`/bugs/${id}`, payload);
    return response.data.data;
  },

  async deleteBugReport(id: string): Promise<void> {
    await api.delete(`/bugs/${id}`);
  },

  async assignBug(id: string, assignedTo: string): Promise<BugReport> {
    const response = await api.put<ApiResponse<BugReport>>(`/bugs/${id}/assign`, { assignedTo });
    return response.data.data;
  },
};

export default bugService;

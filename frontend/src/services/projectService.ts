import { apiClient } from './apiClient';
import type { Project } from '../types';

export const projectService = {
  getProjects: (): Promise<Project[]> => apiClient<Project[]>('/projects'),
  getProject: (id: string): Promise<Project> => apiClient<Project>(`/projects/${id}`),
  createProject: (payload: Omit<Project, 'id' | 'created_at'>): Promise<Project> => 
    apiClient<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        created_at: new Date().toISOString(),
      }),
    }),
  updateProject: (id: string, payload: Partial<Project>): Promise<Project> => 
    apiClient<Project>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  deleteProject: (id: string): Promise<void> => 
    apiClient(`/projects/${id}`, { method: 'DELETE' }),
};
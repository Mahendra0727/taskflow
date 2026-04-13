import { useEffect, useState, useCallback } from 'react';
import type { Project } from '../types';
import { projectService } from '../services/projectService';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(
    async (payload: Omit<Project, 'id' | 'created_at'>) => {
      try {
        setError('');
        const created = await projectService.createProject(payload);
        setProjects((prev) => [created, ...prev]);
        return created;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to create project';
        setError(message);
        throw err;
      }
    },
    []
  );

  const updateProject = useCallback(
    async (id: string, payload: Partial<Project>) => {
      try {
        setError('');
        const updated = await projectService.updateProject(id, payload);
        setProjects((prev) =>
          prev.map((project) => (project.id === id ? updated : project))
        );
        return updated;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to update project';
        setError(message);
        throw err;
      }
    },
    []
  );

  const deleteProject = useCallback(async (id: string) => {
    try {
      setError('');
      await projectService.deleteProject(id);
      setProjects((prev) => prev.filter((project) => project.id !== id));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete project';
      setError(message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    setProjects,
  };
}
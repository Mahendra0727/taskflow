import { useCallback, useEffect, useState } from "react";
import type { Task, TaskStatus } from "../types";
import { taskService } from "../services/taskService";

export function useTasks(projectId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async () => {
    if (!projectId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await taskService.getTasksByProject(projectId);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const createTask = useCallback(
    async (payload: Omit<Task, "id" | "created_at" | "updated_at">) => {
      const created = await taskService.createTask(payload);
      setTasks((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  const updateTask = useCallback(async (id: string, payload: Partial<Task>) => {
    const updated = await taskService.updateTask(id, payload);
    setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
    return updated;
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await taskService.deleteTask(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

const updateTaskStatus = useCallback(
  async (taskId: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        String(task.id) === String(taskId)
          ? { ...task, status, updated_at: new Date().toISOString() }
          : task
      )
    );

    try {
      const updatedTask = await taskService.updateTask(taskId, { status });

      setTasks((prev) =>
        prev.map((task) =>
          String(task.id) === String(taskId) ? updatedTask : task
        )
      );
    } catch (err) {
      await fetchTasks();
      throw err;
    }
  },
  [fetchTasks]
);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    setTasks,
  };
}
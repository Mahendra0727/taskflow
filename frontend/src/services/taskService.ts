import { apiClient } from "./apiClient";
import type { Task } from "../types";

export const taskService = {
  getTasksByProject(projectId: string) {
    return apiClient<Task[]>(`/tasks?projectId=${projectId}`);
  },

  getTask(id: string) {
    return apiClient<Task>(`/tasks/${id}`);
  },

  createTask(payload: Omit<Task, "id" | "created_at" | "updated_at">) {
    const now = new Date().toISOString();

    return apiClient<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        created_at: now,
        updated_at: now,
      }),
    });
  },

  updateTask(id: string, payload: Partial<Task>) {
    return apiClient<Task>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        ...payload,
        updated_at: new Date().toISOString(),
      }),
    });
  },

  deleteTask(id: string) {
    return apiClient<void>(`/tasks/${id}`, {
      method: "DELETE",
    });
  },
};
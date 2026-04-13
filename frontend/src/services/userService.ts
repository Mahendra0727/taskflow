import { apiClient } from "./apiClient";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  password?: string;
  created_at?: string;
};

export const userService = {
  getUsers() {
    return apiClient<AppUser[]>("/users");
  },

  getUser(id: string) {
    return apiClient<AppUser>(`/users/${id}`);
  },
};
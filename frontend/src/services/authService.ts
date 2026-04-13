import { apiClient } from './apiClient';
import type { AuthUser, LoginPayload, RegisterPayload } from '../types';

export const authService = {
  login(payload: LoginPayload) {
    return apiClient<AuthUser>('/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  register(payload: RegisterPayload) {
    return apiClient<AuthUser>('/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
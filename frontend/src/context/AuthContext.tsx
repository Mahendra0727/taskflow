import { createContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { AuthUser, LoginPayload, RegisterPayload } from "../types";
import { authService } from "../services/authService";
import { STORAGE_KEYS } from "../utils/constants";
import { storage } from "../utils/storage";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = storage.get<AuthUser>(STORAGE_KEYS.authUser);
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (payload: LoginPayload) => {
    const authUser = await authService.login(payload);
    setUser(authUser);
    storage.set(STORAGE_KEYS.authUser, authUser);
  };

  const register = async (payload: RegisterPayload) => {
    const authUser = await authService.register(payload);
    setUser(authUser);
    storage.set(STORAGE_KEYS.authUser, authUser);
  };

  const logout = () => {
    setUser(null);
    storage.remove(STORAGE_KEYS.authUser);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

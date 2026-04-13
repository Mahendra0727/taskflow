import { createContext, useMemo, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { STORAGE_KEYS } from "../utils/constants";
import { storage } from "../utils/storage";

interface ThemeModeContextValue {
  mode: "light" | "dark";
  toggleMode: () => void;
}

export const ThemeModeContext = createContext<
  ThemeModeContextValue | undefined
>(undefined);

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = storage.get<"light" | "dark">(STORAGE_KEYS.themeMode);
    if (saved) setMode(saved);
  }, []);

  const toggleMode = () => {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    storage.set(STORAGE_KEYS.themeMode, next);
  };

  const value = useMemo(() => ({ mode, toggleMode }), [mode]);

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
}

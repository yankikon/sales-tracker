import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AppState } from "../lib/types";
import { demoState, STORAGE_KEY } from "../lib/demo";

export const ThemeCtx = createContext<"light" | "dark">("light");

const StoreCtx = createContext<{ state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> } | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AppState) : demoState();
    } catch {
      return demoState();
    }
  });
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);
  const value = useMemo(() => ({ state, setState }), [state]);
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

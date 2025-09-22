import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AppState } from "../lib/types";
import { demoState, STORAGE_KEY } from "../lib/demo";

export const ThemeCtx = createContext<"light" | "dark">("light");

const StoreCtx = createContext<{ state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> } | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  function normalizeState(raw: unknown): AppState {
    const base = (raw as AppState) || ({} as AppState);
    return {
      business: base.business || { name: "", address: "" },
      branches: Array.isArray(base.branches) ? base.branches : [],
      executives: Array.isArray(base.executives) ? base.executives : [],
      sales: Array.isArray(base.sales) ? base.sales : [],
      inventory: Array.isArray((base as any).inventory) ? (base as any).inventory : [],
      categories: Array.isArray((base as any).categories) ? (base as any).categories : ["Electronics", "Home", "Accessories", "Lights", "Furniture"],
    };
  }

  const [state, setState] = useState<AppState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? normalizeState(JSON.parse(raw)) : demoState();
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

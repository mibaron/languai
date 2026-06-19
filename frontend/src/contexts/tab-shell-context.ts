"use client";

import { createContext, useContext } from "react";

import type { TabShellContextValue } from "@/types/tab-shell";

export const TabShellContext = createContext<TabShellContextValue | null>(null);

export function useTabShellContext(): TabShellContextValue {
  const ctx = useContext(TabShellContext);
  if (!ctx) {
    throw new Error("useTabShellContext must be used within TabShellProvider");
  }
  return ctx;
}

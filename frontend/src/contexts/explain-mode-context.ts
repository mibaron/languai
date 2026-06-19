"use client";

import { createContext, useContext } from "react";

import type { ExplainModeContextValue } from "@/types/explain-mode";

export const ExplainModeContext =
  createContext<ExplainModeContextValue | null>(null);

export function useExplainModeContext(): ExplainModeContextValue {
  const ctx = useContext(ExplainModeContext);
  if (!ctx) {
    throw new Error(
      "useExplainModeContext must be used within ExplainModeProvider",
    );
  }
  return ctx;
}

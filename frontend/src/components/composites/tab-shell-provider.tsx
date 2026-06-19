"use client";

import { TabShellContext } from "@/contexts/tab-shell-context";
import { useTabShell } from "@/hooks/use-tab-shell";

export function TabShellProvider({ children }: { children: React.ReactNode }) {
  const value = useTabShell();

  return (
    <TabShellContext.Provider value={value}>{children}</TabShellContext.Provider>
  );
}

"use client";

import { useTabShellContext } from "@/contexts/tab-shell-context";
import { ExplainModeContext } from "@/contexts/explain-mode-context";
import { useExplainMode } from "@/hooks/use-explain-mode";

export function ExplainModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { switchTab } = useTabShellContext();
  const value = useExplainMode(switchTab);

  return (
    <ExplainModeContext.Provider value={value}>
      {children}
    </ExplainModeContext.Provider>
  );
}

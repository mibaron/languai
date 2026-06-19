"use client";

import { BottomTabBar } from "@/components/composites/bottom-tab-bar";
import { ExplainModeProvider } from "@/components/composites/explain-mode-provider";
import { TabShell } from "@/components/composites/tab-shell";
import { TabShellProvider } from "@/components/composites/tab-shell-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <TabShellProvider>
      <ExplainModeProvider>
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="flex h-full w-full max-w-md flex-col">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <TabShell>{children}</TabShell>
            </div>
            <BottomTabBar />
          </div>
        </div>
      </ExplainModeProvider>
    </TabShellProvider>
  );
}

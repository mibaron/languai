"use client";

import { BottomTabBar } from "@/components/composites/bottom-tab-bar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex h-full w-full max-w-md flex-col">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </div>
        <BottomTabBar />
      </div>
    </div>
  );
}

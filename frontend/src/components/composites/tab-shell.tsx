"use client";

import { useTabShellContext } from "@/contexts/tab-shell-context";
import { LearnTabContent } from "@/app/(app)/learn/_components/learn-tab-content";
import { ExplainTabContent } from "@/app/(app)/explain/_components/explain-tab-content";
import { PracticeTabContent } from "@/app/(app)/practice/_components/practice-tab-content";
import { ProfileTabContent } from "@/app/(app)/profile/_components/profile-tab-content";

import type { TabId } from "@/types/tab-shell";

const TAB_COMPONENTS: Record<TabId, React.ComponentType> = {
  learn: LearnTabContent,
  explain: ExplainTabContent,
  practice: PracticeTabContent,
  profile: ProfileTabContent,
};

const TAB_IDS: TabId[] = ["learn", "explain", "practice", "profile"];

export function TabShell({ children }: { children: React.ReactNode }) {
  const { activeTab, isSubRoute } = useTabShellContext();

  return (
    <>
      {TAB_IDS.map((id) => {
        const Component = TAB_COMPONENTS[id];
        const visible = !isSubRoute && activeTab === id;
        return (
          <div
            key={id}
            style={{ display: visible ? "flex" : "none" }}
            className="min-h-0 flex-1 flex-col overflow-hidden"
          >
            <Component />
          </div>
        );
      })}
      {isSubRoute && children}
    </>
  );
}

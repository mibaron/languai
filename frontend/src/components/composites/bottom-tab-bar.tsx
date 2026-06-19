"use client";

import { BookOpen, BarChart2, Lightbulb, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

import { useExplainModeContext } from "@/contexts/explain-mode-context";
import { useTabShellContext } from "@/contexts/tab-shell-context";
import type { TabId } from "@/types/tab-shell";
import type { BottomTabBarProps } from "./types";

const tabs: { id: TabId; icon: typeof BookOpen; label: string }[] = [
  { id: "learn", icon: BookOpen, label: "Learn" },
  { id: "explain", icon: Lightbulb, label: "Explain" },
  { id: "practice", icon: BarChart2, label: "Practice" },
  { id: "profile", icon: User, label: "Profile" },
];

export function BottomTabBar({ className }: BottomTabBarProps) {
  const { activeTab, switchTab } = useTabShellContext();
  const {
    explainMode,
    hasExplainableContent,
    isExplaining,
    enterExplainMode,
    exitExplainMode,
  } = useExplainModeContext();

  const handleTabClick = (tabId: TabId) => {
    if (tabId === "explain") {
      if (!explainMode) {
        if (hasExplainableContent) {
          enterExplainMode();
        } else {
          switchTab("explain");
        }
      } else {
        switchTab("explain");
      }
    } else {
      if (explainMode) exitExplainMode();
      switchTab(tabId);
    }
  };

  return (
    <nav
      className={cn(
        "flex shrink-0 border-t border-border bg-background pb-[env(safe-area-inset-bottom,34px)]",
        className,
      )}
    >
      {tabs.map((tab) => {
        const isExplainTab = tab.id === "explain";
        const isActive =
          isExplainTab ? explainMode || activeTab === "explain" : activeTab === tab.id;
        const Icon =
          isExplainTab && explainMode ? Sparkles : tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            disabled={isExplaining}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-[3px] py-[6px] transition-colors duration-150",
              isActive ? "text-brand" : "text-muted-foreground",
              isExplaining && "pointer-events-none opacity-50",
            )}
          >
            <Icon
              size={22}
              strokeWidth={isActive ? 2.25 : 1.75}
              className={cn(
                isExplainTab && explainMode && "animate-pulse",
              )}
            />
            <span
              className={cn(
                "text-[10px] tracking-[0.01em]",
                isActive ? "font-bold" : "font-normal",
              )}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

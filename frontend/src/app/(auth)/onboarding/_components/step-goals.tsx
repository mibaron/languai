"use client";

import { GraduationCap, Home, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

import type { StepGoalsProps } from "./types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "graduation-cap": GraduationCap,
  home: Home,
  briefcase: Briefcase,
};

export function StepGoals({
  goals,
  selectedGoalId,
  onSelect,
  isLoading,
}: StepGoalsProps) {
  if (isLoading) {
    return (
      <div className="px-5 pt-6">
        <div className="flex items-center justify-center py-12">
          <div className="size-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6">
      <h2 className="mb-2 text-[22px] font-bold tracking-[-0.02em] text-foreground">
        What&apos;s your goal?
      </h2>
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        This helps us tailor your learning experience.
      </p>
      <div className="flex flex-col gap-2.5">
        {goals.map((goal) => {
          const isSelected = selectedGoalId === goal.id;
          const Icon = ICON_MAP[goal.icon];

          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => onSelect(goal.id)}
              className={cn(
                "flex items-center gap-3.5 rounded-[14px] px-4 py-3.5 text-left transition-colors",
                isSelected
                  ? "border-2 border-brand bg-brand-muted"
                  : "border-[1.5px] border-border bg-muted/50 hover:border-brand/40",
              )}
            >
              <div
                className={cn(
                  "flex size-[42px] shrink-0 items-center justify-center rounded-[11px]",
                  isSelected ? "bg-brand" : "bg-muted",
                )}
              >
                {Icon && (
                  <Icon
                    className={cn(
                      "size-5",
                      isSelected ? "text-white" : "text-muted-foreground",
                    )}
                  />
                )}
              </div>
              <div className="flex-1">
                <div
                  className={cn(
                    "text-[15px] font-semibold",
                    isSelected ? "text-brand-light" : "text-foreground",
                  )}
                >
                  {goal.name}
                </div>
                {goal.description && (
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {goal.description}
                  </div>
                )}
              </div>
              <div
                className={cn(
                  "flex size-[22px] shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isSelected
                    ? "border-brand bg-brand"
                    : "border-border bg-transparent",
                )}
              >
                {isSelected && (
                  <div className="size-2 rounded-full bg-white" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

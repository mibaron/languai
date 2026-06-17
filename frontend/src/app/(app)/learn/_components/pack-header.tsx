"use client";

import { ChevronDown } from "lucide-react";

import { ProgressRing } from "@/components/composites/progress-ring";

import type { PackHeaderProps } from "./types";

export function PackHeader({
  activePack,
  overallProgress,
  onOpenPackDrawer,
  onOpenStats,
}: PackHeaderProps) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 px-4 pb-2 pt-2.5">
      <button
        onClick={onOpenPackDrawer}
        className="flex flex-1 items-center justify-between rounded-xl bg-muted p-3 text-left"
      >
        <div>
          <div className="text-[17px] font-bold tracking-[-0.02em] text-foreground">
            {activePack?.title ?? "Select a pack"}
          </div>
          {activePack && (
            <div className="text-xs text-muted-foreground">
              in {activePack.base_language}
            </div>
          )}
        </div>
        <ChevronDown size={16} className="text-muted-foreground" />
      </button>
      <button onClick={onOpenStats} className="shrink-0">
        <ProgressRing value={overallProgress} size={50} />
      </button>
    </div>
  );
}

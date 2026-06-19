"use client";

import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

import type { SectionDetailHeaderProps } from "./types";

export function SectionDetailHeader({
  title,
  sectionIndex,
  totalSections,
  onBack,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: SectionDetailHeaderProps) {
  return (
    <div className="flex shrink-0 items-center gap-1 border-b border-border/50 px-2 py-2.5">
      <button
        onClick={onBack}
        className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
        aria-label="Back to sections"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="min-w-0 flex-1 text-center">
        <div className="truncate text-sm font-semibold text-foreground">
          {title}
        </div>
        <div className="text-[11px] text-muted-foreground">
          {sectionIndex + 1} of {totalSections}
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label="Previous section"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label="Next section"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

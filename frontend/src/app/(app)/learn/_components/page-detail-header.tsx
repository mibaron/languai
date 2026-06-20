"use client";

import { ArrowLeft, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

import type { PageDetailHeaderProps } from "./types";

export function PageDetailHeader({
  title,
  pageIndex,
  totalPages,
  isStudied,
  onBack,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: PageDetailHeaderProps) {
  return (
    <div className="flex shrink-0 items-center gap-1 border-b border-border/50 px-2 py-2.5">
      <button
        onClick={onBack}
        className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
        aria-label="Back to pages"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="min-w-0 flex-1 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <span className="truncate text-sm font-semibold text-foreground">
            {title}
          </span>
          {isStudied && (
            <Check size={14} className="shrink-0 text-green-600 dark:text-green-400" />
          )}
        </div>
        <div className="text-[11px] text-muted-foreground">
          {pageIndex + 1} of {totalPages}
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className={cn(
            "flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted",
            "disabled:opacity-30 disabled:hover:bg-transparent",
          )}
          aria-label="Previous page"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className={cn(
            "flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted",
            "disabled:opacity-30 disabled:hover:bg-transparent",
          )}
          aria-label="Next page"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

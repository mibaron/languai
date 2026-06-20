"use client";

import { BookOpen, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

import type { PageCardProps } from "./types";

export function PageCard({ page, onOpen }: PageCardProps) {
  return (
    <button
      onClick={() => onOpen(page)}
      className="flex w-full items-center gap-3 border-b border-border/50 px-4 py-[13px] text-left"
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-[10px]",
          page.is_studied
            ? "bg-green-500/10"
            : "bg-brand/10",
        )}
      >
        {page.is_studied ? (
          <Check size={18} className="text-green-600 dark:text-green-400" />
        ) : (
          <BookOpen size={18} className="text-brand" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-[5px] truncate text-sm font-medium text-foreground">
          {page.title}
        </div>
        <span className="text-xs text-muted-foreground/70">
          {page.part_count} {page.part_count === 1 ? "part" : "parts"}
        </span>
      </div>
      <ChevronRight size={16} className="text-muted-foreground/30" />
    </button>
  );
}

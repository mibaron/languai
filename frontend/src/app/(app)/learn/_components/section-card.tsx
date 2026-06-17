"use client";

import { Table, AlignLeft, LayoutGrid, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

import type { SectionCardProps } from "./types";

const typeConfig = {
  table: {
    icon: Table,
    bg: "bg-sky-500/10",
    iconColor: "text-sky-600 dark:text-sky-400",
    itemLabel: "rows",
  },
  notes: {
    icon: AlignLeft,
    bg: "bg-muted",
    iconColor: "text-muted-foreground",
    itemLabel: "rules",
  },
  grid: {
    icon: LayoutGrid,
    bg: "bg-green-500/10",
    iconColor: "text-green-600 dark:text-green-400",
    itemLabel: "words",
  },
} as const;

export function SectionCard({ section, onOpen }: SectionCardProps) {
  const config = typeConfig[section.type] || typeConfig.notes;
  const Icon = config.icon;

  return (
    <button
      onClick={() => onOpen(section)}
      className="flex w-full items-center gap-3 border-b border-border/50 px-4 py-[13px] text-left"
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-[10px]",
          config.bg,
        )}
      >
        <Icon size={18} className={config.iconColor} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-[5px] truncate text-sm font-medium text-foreground">
          {section.title}
        </div>
        <span className="text-xs text-muted-foreground/70">
          {section.items.length} {config.itemLabel}
        </span>
      </div>
      <ChevronRight size={16} className="text-muted-foreground/30" />
    </button>
  );
}

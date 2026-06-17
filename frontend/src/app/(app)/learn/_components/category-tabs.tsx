"use client";

import { cn } from "@/lib/utils";
import type { CategoryId } from "@/types/content";

import type { CategoryTabsProps } from "./types";

const categories: { id: CategoryId; label: string }[] = [
  { id: "grammar", label: "Grammar" },
  { id: "vocab", label: "Vocabulary" },
  { id: "verbs", label: "Verbs" },
  { id: "phrases", label: "Phrases" },
];

export function CategoryTabs({
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="flex shrink-0 border-b border-border">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={cn(
              "-mb-px flex-1 border-b-2 px-1 py-[9px] text-xs transition-all duration-150",
              isActive
                ? "border-brand font-bold text-brand"
                : "border-transparent font-normal text-muted-foreground",
            )}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

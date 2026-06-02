"use client";

import { cn } from "@/lib/utils";
import type { CategoryId } from "@/types/content";

import { CATEGORY_TABS } from "@/data/tabs";

import type { CategoryTabsProps } from "./types";

export function CategoryTabs({ currentCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-0.5">
      {CATEGORY_TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onCategoryChange(tab.id as CategoryId)}
          className={cn(
            "cursor-pointer rounded-t-lg border-none px-3 py-2 text-sm font-semibold transition-colors",
            currentCategory === tab.id
              ? "bg-stone-200 text-emerald-900"
              : "bg-transparent text-emerald-400 hover:text-emerald-300",
          )}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </div>
  );
}

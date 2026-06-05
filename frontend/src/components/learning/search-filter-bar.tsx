"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CategoryId, LevelCode } from "@/types/content";

import { CATEGORY_TABS, LEVEL_CODES } from "@/data/tabs";

import type { SearchFilterBarProps } from "./types";

export function SearchFilterBar({
  results,
  selectedLevel,
  selectedCategory,
  onLevelChange,
  onCategoryChange,
}: SearchFilterBarProps) {
  const levelsWithResults = new Set(results.matches.map((m) => m.levelCode));
  const categoriesWithResults = new Set(results.matches.map((m) => m.category));

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap items-center gap-1 rounded-lg border bg-muted/50 p-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLevelChange(null)}
          className={cn(
            "h-7 rounded-md px-2.5 text-xs font-semibold",
            selectedLevel === null
              ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          All
        </Button>
        {LEVEL_CODES.map((code) => {
          const hasResults = levelsWithResults.has(code as LevelCode);
          return (
            <Button
              key={code}
              variant="ghost"
              size="sm"
              disabled={!hasResults}
              onClick={() => onLevelChange(code as LevelCode)}
              className={cn(
                "h-7 rounded-md px-2.5 text-xs font-semibold",
                selectedLevel === code
                  ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {code}
            </Button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-1 rounded-lg border bg-muted/50 p-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCategoryChange(null)}
          className={cn(
            "h-7 rounded-md px-2.5 text-xs font-semibold",
            selectedCategory === null
              ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          All
        </Button>
        {CATEGORY_TABS.map((tab) => {
          const hasResults = categoriesWithResults.has(tab.id as CategoryId);
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              disabled={!hasResults}
              onClick={() => onCategoryChange(tab.id as CategoryId)}
              className={cn(
                "h-7 rounded-md px-2.5 text-xs font-semibold",
                selectedCategory === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

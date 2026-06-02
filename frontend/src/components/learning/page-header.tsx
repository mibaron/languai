"use client";

import { Badge } from "@/components/ui/badge";

import { CategoryTabs } from "./category-tabs";
import { LevelSwitcher } from "./level-switcher";
import type { PageHeaderProps } from "./types";

export function PageHeader({
  currentLevel,
  currentCategory,
  onLevelChange,
  onCategoryChange,
}: PageHeaderProps) {
  return (
    <div className="bg-emerald-900 pb-0">
      <div className="mx-auto max-w-3xl px-4 pt-4">
        <div className="mb-1 flex items-center gap-3">
          <h1 className="m-0 font-serif text-2xl font-bold text-emerald-100">
            Deutsch Spickzettel
          </h1>
          <Badge className="bg-amber-500 text-xs font-extrabold tracking-wider text-amber-950">
            Starten Wir!
          </Badge>
        </div>
        <p className="mb-3 text-xs text-emerald-400">
          Grammar-focused cheat sheet · Updated content
        </p>
        <div className="mb-3">
          <LevelSwitcher currentLevel={currentLevel} onLevelChange={onLevelChange} />
        </div>
        <CategoryTabs currentCategory={currentCategory} onCategoryChange={onCategoryChange} />
      </div>
    </div>
  );
}

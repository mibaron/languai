"use client";

import { Badge } from "@/components/ui/badge";
import { BOOKS } from "@/data/books";

import { CategoryTabs } from "./category-tabs";
import { LevelSwitcher } from "./level-switcher";
import { SectionList } from "./section-list";
import type { ContentPanelProps } from "./types";

export function ContentPanel({
  currentLevel,
  currentCategory,
  onLevelChange,
  onCategoryChange,
}: ContentPanelProps) {
  const sections = BOOKS[currentLevel][currentCategory];

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight">German Course</h2>
            <Badge variant="secondary" className="text-xs">
              {currentLevel}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {sections.length} {sections.length === 1 ? "section" : "sections"}
          </p>
        </div>
        <LevelSwitcher currentLevel={currentLevel} onLevelChange={onLevelChange} />
      </div>

      <div className="mb-5">
        <CategoryTabs currentCategory={currentCategory} onCategoryChange={onCategoryChange} />
      </div>

      <SectionList
        sections={sections}
        storageKey={`sections:${currentLevel}:${currentCategory}`}
        levelCode={currentLevel}
        category={currentCategory}
      />
    </div>
  );
}

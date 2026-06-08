"use client";

import { BOOKS } from "@/data/books";

import { ContentFilterDrawer } from "./content-filter-drawer";
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
    <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6">
      <div className="mb-4">
        <ContentFilterDrawer
          currentLevel={currentLevel}
          currentCategory={currentCategory}
          onLevelChange={onLevelChange}
          onCategoryChange={onCategoryChange}
          sectionCount={sections.length}
        />
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

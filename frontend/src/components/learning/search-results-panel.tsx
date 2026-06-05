"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CategoryId, LevelCode } from "@/types/content";

import { SearchFilterBar } from "./search-filter-bar";
import { SearchResultCard } from "./search-result-card";
import type { SearchResultsPanelProps } from "./types";

export function SearchResultsPanel({ results, onClear }: SearchResultsPanelProps) {
  const [selectedLevel, setSelectedLevel] = useState<LevelCode | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);

  const filtered = useMemo(() => {
    return results.matches.filter((m) => {
      if (selectedLevel && m.levelCode !== selectedLevel) return false;
      if (selectedCategory && m.category !== selectedCategory) return false;
      return true;
    });
  }, [results.matches, selectedLevel, selectedCategory]);

  const filteredMatchCount = filtered.reduce((sum, m) => sum + m.totalMatches, 0);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Results for &ldquo;{results.query}&rdquo;
            </h2>
            <p className="text-sm text-muted-foreground">
              {filteredMatchCount} {filteredMatchCount === 1 ? "match" : "matches"} in{" "}
              {filtered.length} {filtered.length === 1 ? "section" : "sections"}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClear} className="gap-1.5">
          <X className="h-4 w-4" />
          Clear
        </Button>
      </div>

      <SearchFilterBar
        results={results}
        selectedLevel={selectedLevel}
        selectedCategory={selectedCategory}
        onLevelChange={setSelectedLevel}
        onCategoryChange={setSelectedCategory}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Search className="mb-3 h-10 w-10 opacity-40" />
          <p className="text-sm">No results found. Try a different filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((match, i) => (
            <SearchResultCard key={i} match={match} query={results.query} />
          ))}
        </div>
      )}
    </div>
  );
}

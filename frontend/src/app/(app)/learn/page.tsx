"use client";

import { useMemo, useState } from "react";

import { ContentPanel } from "@/components/learning/content-panel";
import { Navbar } from "@/components/learning/navbar";
import { SearchResultsPanel } from "@/components/learning/search-results-panel";
import { searchAllContent } from "@/lib/search-content";
import type { CategoryId, LevelCode } from "@/types/content";

export default function CheatSheetPage() {
  const [level, setLevel] = useState<LevelCode>("A1.1");
  const [category, setCategory] = useState<CategoryId>("grammar");
  const [search, setSearch] = useState("");

  const searchResults = useMemo(
    () => searchAllContent(search),
    [search],
  );

  const isSearching = search.trim().length > 0;

  const handleLevelChange = (newLevel: LevelCode) => {
    setLevel(newLevel);
    setCategory("grammar");
  };

  const handleClearSearch = () => {
    setSearch("");
  };

  return (
    <>
      <Navbar search={search} onSearchChange={setSearch} />
      {isSearching ? (
        <SearchResultsPanel results={searchResults} onClear={handleClearSearch} />
      ) : (
        <ContentPanel
          currentLevel={level}
          currentCategory={category}
          onLevelChange={handleLevelChange}
          onCategoryChange={(cat) => setCategory(cat)}
        />
      )}
    </>
  );
}

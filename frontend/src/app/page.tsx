"use client";

import { useState } from "react";

import { PageHeader } from "@/components/learning/page-header";
import { SearchInput } from "@/components/learning/search-input";
import { SectionList } from "@/components/learning/section-list";
import { BOOKS } from "@/data/books";
import { filterSections } from "@/lib/filter-sections";
import type { CategoryId, LevelCode } from "@/types/content";

export default function CheatSheetPage() {
  const [level, setLevel] = useState<LevelCode>("A1.1");
  const [category, setCategory] = useState<CategoryId>("grammar");
  const [search, setSearch] = useState("");

  const sections = BOOKS[level][category];
  const filtered = filterSections(sections, search);

  const handleLevelChange = (newLevel: LevelCode) => {
    setLevel(newLevel);
    setCategory("grammar");
    setSearch("");
  };

  const handleCategoryChange = (newCategory: CategoryId) => {
    setCategory(newCategory);
    setSearch("");
  };

  return (
    <>
      <PageHeader
        currentLevel={level}
        currentCategory={category}
        onLevelChange={handleLevelChange}
        onCategoryChange={handleCategoryChange}
      />
      <SearchInput value={search} onChange={setSearch} />
      <SectionList sections={filtered} />
    </>
  );
}

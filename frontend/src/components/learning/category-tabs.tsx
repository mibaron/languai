"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CategoryId } from "@/types/content";

import { CATEGORY_TABS } from "@/data/tabs";

import type { CategoryTabsProps } from "./types";

export function CategoryTabs({ currentCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <Tabs
      value={currentCategory}
      onValueChange={(value) => onCategoryChange(value as CategoryId)}
    >
      <TabsList className="h-auto flex-wrap gap-1 bg-transparent p-0">
        {CATEGORY_TABS.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="rounded-md px-3 py-1.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
          >
            {tab.icon} {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

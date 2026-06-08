"use client";

import { ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { CategoryTabs } from "./category-tabs";
import { LevelSwitcher } from "./level-switcher";
import type { ContentFilterDrawerProps } from "./types";

import { CATEGORY_TABS } from "@/data/tabs";

export function ContentFilterDrawer({
  currentLevel,
  currentCategory,
  onLevelChange,
  onCategoryChange,
  sectionCount,
}: ContentFilterDrawerProps) {
  const categoryLabel = CATEGORY_TABS.find((t) => t.id === currentCategory)?.label ?? currentCategory;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="flex w-full items-center justify-between rounded-lg border bg-muted/30 px-3 py-2 text-left transition-colors hover:bg-muted/50">
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="secondary" className="text-xs font-semibold">
              {currentLevel}
            </Badge>
            <span className="font-medium">{categoryLabel}</span>
            <span className="text-muted-foreground">· {sectionCount} sections</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter Content</DrawerTitle>
        </DrawerHeader>

        <div className="space-y-5 px-4 pb-6">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Level</p>
            <LevelSwitcher currentLevel={currentLevel} onLevelChange={onLevelChange} />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Category</p>
            <CategoryTabs currentCategory={currentCategory} onCategoryChange={onCategoryChange} />
          </div>
        </div>

        <div className="border-t px-4 py-3">
          <DrawerClose asChild>
            <Button variant="default" size="sm" className="w-full">
              Done
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

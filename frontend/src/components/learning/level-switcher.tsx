"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LevelCode } from "@/types/content";

import { LEVEL_CODES } from "@/data/tabs";

import type { LevelSwitcherProps } from "./types";

export function LevelSwitcher({ currentLevel, onLevelChange }: LevelSwitcherProps) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1 rounded-lg border bg-muted/50 p-1">
      {LEVEL_CODES.map((code) => (
        <Button
          key={code}
          variant="ghost"
          size="sm"
          onClick={() => onLevelChange(code as LevelCode)}
          className={cn(
            "h-7 rounded-md px-3 text-xs font-semibold",
            currentLevel === code
              ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {code}
        </Button>
      ))}
    </div>
  );
}

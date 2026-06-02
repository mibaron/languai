"use client";

import { Button } from "@/components/ui/button";
import type { LevelCode } from "@/types/content";

import { LEVEL_CODES } from "@/data/tabs";

import type { LevelSwitcherProps } from "./types";

export function LevelSwitcher({ currentLevel, onLevelChange }: LevelSwitcherProps) {
  return (
    <div className="flex gap-1.5">
      {LEVEL_CODES.map((code) => (
        <Button
          key={code}
          variant={currentLevel === code ? "default" : "outline"}
          size="sm"
          onClick={() => onLevelChange(code as LevelCode)}
          className={
            currentLevel === code
              ? "rounded-full border-2 border-amber-500 bg-amber-500 font-bold text-amber-950 hover:bg-amber-400"
              : "rounded-full border-2 border-emerald-700 bg-transparent font-bold text-emerald-400 hover:bg-emerald-800"
          }
        >
          {code}
        </Button>
      ))}
    </div>
  );
}

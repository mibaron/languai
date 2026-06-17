"use client";

import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { ProgressHeaderProps } from "./types";

export function ProgressHeader({
  currentStep,
  totalSteps,
  onBack,
}: ProgressHeaderProps) {
  return (
    <div className="flex shrink-0 items-center gap-3 px-5 pt-1">
      {currentStep > 1 ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="size-9 rounded-full"
        >
          <ChevronLeft className="size-5" />
        </Button>
      ) : (
        <div className="size-9" />
      )}
      <div className="flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-[3px] rounded-full bg-brand transition-[width] duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      <span className="w-9 text-right text-xs font-medium text-muted-foreground">
        {currentStep} / {totalSteps}
      </span>
    </div>
  );
}

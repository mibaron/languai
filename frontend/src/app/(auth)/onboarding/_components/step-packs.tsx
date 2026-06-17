"use client";

import { BookOpen, Check, Languages, PenLine } from "lucide-react";

import { cn } from "@/lib/utils";

import type { StepPacksProps } from "./types";

export function StepPacks({
  packs,
  selectedPackIds,
  onToggle,
  isLoading,
}: StepPacksProps) {
  return (
    <div className="px-5 pt-6">
      <h2 className="mb-2 text-[22px] font-bold tracking-[-0.02em] text-foreground">
        Pick your first pack
      </h2>
      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
        Curated sets of grammar, vocabulary, and exercises for each level.
      </p>
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[120px] animate-pulse rounded-2xl bg-muted"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {packs.map((pack) => {
            const selected = selectedPackIds.includes(pack.id);
            return (
              <button
                key={pack.id}
                onClick={() => onToggle(pack.id)}
                className={cn(
                  "w-full rounded-2xl px-4 py-4 text-left transition-all",
                  selected
                    ? "border-2 border-brand bg-brand-muted"
                    : "border-[1.5px] border-border bg-background",
                )}
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <div>
                    <div
                      className={cn(
                        "text-[15px] font-semibold",
                        selected ? "text-brand-light" : "text-foreground",
                      )}
                    >
                      {pack.title}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {pack.level_code} · {pack.base_language.toUpperCase()}
                    </div>
                  </div>
                  {selected ? (
                    <div className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-brand">
                      <Check className="size-3 text-white" strokeWidth={2.5} />
                    </div>
                  ) : (
                    <div className="size-[22px] shrink-0 rounded-full border-[1.5px] border-border" />
                  )}
                </div>
                {pack.description && (
                  <p className="mb-3 text-[13px] leading-relaxed text-muted-foreground">
                    {pack.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="size-3" />
                    {pack.grammar_count} grammar
                  </span>
                  <span className="flex items-center gap-1">
                    <Languages className="size-3" />
                    {pack.vocab_count} vocab
                  </span>
                  <span className="flex items-center gap-1">
                    <PenLine className="size-3" />
                    {pack.exercise_count} exercises
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
      <div className="h-6" />
    </div>
  );
}

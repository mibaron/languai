"use client";

import { cn } from "@/lib/utils";

import type { FlashcardExercise as FlashcardExerciseType } from "@/lib/api/orval/api/generated/model";

interface FlashcardExerciseProps {
  exercise: FlashcardExerciseType;
  isRevealed: boolean;
  onReveal: () => void;
  onRate: (rating: number) => void;
}

const ratingButtons = [
  { rating: 1, label: "Again", color: "bg-red-500 active:bg-red-600" },
  { rating: 2, label: "Hard", color: "bg-orange-500 active:bg-orange-600" },
  { rating: 3, label: "Good", color: "bg-green-500 active:bg-green-600" },
  { rating: 4, label: "Easy", color: "bg-blue-500 active:bg-blue-600" },
] as const;

export function FlashcardExercise({
  exercise,
  isRevealed,
  onReveal,
  onRate,
}: FlashcardExerciseProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 items-center justify-center px-6">
        <button
          type="button"
          onClick={!isRevealed ? onReveal : undefined}
          className={cn(
            "flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl border border-border bg-card p-8 shadow-sm transition-all",
            !isRevealed && "cursor-pointer active:scale-[0.98]",
          )}
        >
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {exercise.front_text}
          </span>
          {exercise.front_context && (
            <span className="text-sm text-muted-foreground">{exercise.front_context}</span>
          )}

          {isRevealed ? (
            <>
              <div className="my-2 h-px w-full bg-border" />
              <span className="text-xl font-semibold text-brand">
                {exercise.back_text}
              </span>
              {exercise.back_context && (
                <span className="text-sm text-muted-foreground">
                  {exercise.back_context}
                </span>
              )}
            </>
          ) : (
            <span className="mt-2 text-sm text-muted-foreground/60">
              Tap to reveal
            </span>
          )}
        </button>
      </div>

      {isRevealed && (
        <div className="flex gap-2 px-4 pb-6 pt-3">
          {ratingButtons.map(({ rating, label, color }) => (
            <button
              key={rating}
              type="button"
              onClick={() => onRate(rating)}
              className={cn(
                "flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-all active:scale-95",
                color,
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {!isRevealed && <div className="h-[68px]" />}
    </div>
  );
}

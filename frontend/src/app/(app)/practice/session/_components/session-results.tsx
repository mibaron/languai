"use client";

import { ProgressRing } from "@/components/composites/progress-ring";

import type { SessionResult } from "./types";

interface SessionResultsProps {
  result: SessionResult;
  onExit: () => void;
}

export function SessionResults({ result, onExit }: SessionResultsProps) {
  const percent = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
      <div className="flex flex-col items-center gap-4">
        <ProgressRing value={percent} size={100} strokeWidth={6} />
        <div className="text-center">
          <div className="text-xl font-bold text-foreground">Session Complete</div>
          <div className="mt-1 text-sm text-muted-foreground">
            {result.correct} of {result.total} correct
          </div>
        </div>
      </div>

      <div className="flex w-full max-w-xs gap-3">
        <div className="flex-1 rounded-xl bg-green-50 py-3 text-center dark:bg-green-500/15">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            {result.correct}
          </div>
          <div className="text-xs text-green-600/70 dark:text-green-400/70">Correct</div>
        </div>
        <div className="flex-1 rounded-xl bg-red-50 py-3 text-center dark:bg-red-500/15">
          <div className="text-lg font-bold text-red-600 dark:text-red-400">
            {result.incorrect}
          </div>
          <div className="text-xs text-red-600/70 dark:text-red-400/70">Incorrect</div>
        </div>
      </div>

      <button
        type="button"
        onClick={onExit}
        className="w-full max-w-xs rounded-xl bg-brand py-3.5 text-center text-sm font-semibold text-white active:scale-[0.98]"
      >
        Done
      </button>
    </div>
  );
}

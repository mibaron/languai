"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

import type { ErrorCorrectionExercise as ErrorCorrectionExerciseType } from "./types";

interface ErrorCorrectionExerciseProps {
  exercise: ErrorCorrectionExerciseType;
  onAnswer: (isCorrect: boolean) => void;
  disabled: boolean;
}

export function ErrorCorrectionExercise({
  exercise,
  onAnswer,
  disabled,
}: ErrorCorrectionExerciseProps) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const errorText = exercise.sentence.slice(exercise.error_start, exercise.error_end);
  const beforeError = exercise.sentence.slice(0, exercise.error_start);
  const afterError = exercise.sentence.slice(exercise.error_end);

  const isCorrect =
    input.toLowerCase().trim() === exercise.correct_replacement.toLowerCase().trim();

  const handleSubmit = () => {
    if (!input.trim() || submitted) return;
    setSubmitted(true);
    onAnswer(isCorrect);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
        <p className="text-sm font-medium text-muted-foreground">
          Find and correct the error
        </p>

        <p className="text-center text-lg text-foreground">
          <span>{beforeError}</span>
          <span className="rounded bg-red-100 px-1 font-semibold text-red-600 dark:bg-red-500/20 dark:text-red-400">
            {errorText}
          </span>
          <span>{afterError}</span>
        </p>

        {!submitted && (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder={`Replace "${errorText}" with…`}
            autoFocus
            className="w-full max-w-xs rounded-xl border-2 border-border bg-card px-4 py-3 text-center text-lg font-medium text-foreground outline-none focus:border-brand"
          />
        )}

        {submitted && (
          <p className="text-center text-lg text-foreground">
            <span>{beforeError}</span>
            <span
              className={cn(
                "rounded px-1 font-semibold",
                isCorrect
                  ? "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400"
                  : "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400",
              )}
            >
              {input}
            </span>
            <span>{afterError}</span>
          </p>
        )}

        {submitted && !isCorrect && (
          <p className="text-sm text-muted-foreground">
            Correct: <span className="font-semibold text-green-600 dark:text-green-400">{exercise.correct_replacement}</span>
          </p>
        )}

        {submitted && exercise.explanation && (
          <p className="text-sm text-muted-foreground">{exercise.explanation}</p>
        )}
      </div>

      {!submitted && (
        <div className="px-4 pb-6 pt-3">
          <button
            type="button"
            disabled={!input.trim() || disabled}
            onClick={handleSubmit}
            className={cn(
              "w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-all active:scale-[0.98]",
              "disabled:opacity-50",
            )}
          >
            Check
          </button>
        </div>
      )}
    </div>
  );
}

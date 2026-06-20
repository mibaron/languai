"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

import type { FillBlankExercise as FillBlankExerciseType } from "./types";

interface FillBlankExerciseProps {
  exercise: FillBlankExerciseType;
  onAnswer: (isCorrect: boolean) => void;
  disabled: boolean;
}

export function FillBlankExercise({
  exercise,
  onAnswer,
  disabled,
}: FillBlankExerciseProps) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const allAccepted = [
    exercise.answer,
    ...(exercise.accept_alternatives ?? []),
  ].map((a) => a.toLowerCase().trim());

  const isCorrect = allAccepted.includes(input.toLowerCase().trim());

  const handleSubmit = () => {
    if (!input.trim() || submitted) return;
    setSubmitted(true);
    onAnswer(isCorrect);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
        <p className="text-center text-lg text-foreground">
          <span>{exercise.text_before} </span>
          <span className="inline-block min-w-[80px] border-b-2 border-brand text-center">
            {submitted ? (
              <span
                className={cn(
                  "font-semibold",
                  isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
                )}
              >
                {input}
              </span>
            ) : null}
          </span>
          <span> {exercise.text_after}</span>
        </p>

        {!submitted && (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Type your answer…"
            autoFocus
            className="w-full max-w-xs rounded-xl border-2 border-border bg-card px-4 py-3 text-center text-lg font-medium text-foreground outline-none focus:border-brand"
          />
        )}

        {submitted && !isCorrect && (
          <p className="text-sm text-muted-foreground">
            Correct answer: <span className="font-semibold text-green-600 dark:text-green-400">{exercise.answer}</span>
          </p>
        )}

        {submitted && exercise.explanation && (
          <p className="text-sm text-muted-foreground">{exercise.explanation}</p>
        )}

        {!submitted && exercise.hint && (
          <p className="text-sm text-muted-foreground/70">{exercise.hint}</p>
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

"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

import type { SentenceOrderExercise as SentenceOrderExerciseType } from "@/lib/api/orval/api/generated/model";

interface SentenceOrderExerciseProps {
  exercise: SentenceOrderExerciseType;
  onAnswer: (isCorrect: boolean) => void;
  disabled: boolean;
}

export function SentenceOrderExercise({
  exercise,
  onAnswer,
  disabled,
}: SentenceOrderExerciseProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const selectedWords = selected.map((i) => exercise.jumbled_words[i]);
  const remaining = exercise.jumbled_words
    .map((_, i) => i)
    .filter((i) => !selected.includes(i));

  const isCorrect = exercise.correct_answers.some(
    (answer) =>
      answer.length === selectedWords.length &&
      answer.every((word, i) => word.toLowerCase() === selectedWords[i].toLowerCase()),
  );

  const handleWordTap = useCallback(
    (index: number) => {
      if (submitted) return;
      setSelected((prev) => [...prev, index]);
    },
    [submitted],
  );

  const handleRemoveWord = useCallback(
    (position: number) => {
      if (submitted) return;
      setSelected((prev) => prev.filter((_, i) => i !== position));
    },
    [submitted],
  );

  const handleSubmit = () => {
    if (selected.length === 0 || submitted) return;
    setSubmitted(true);
    onAnswer(isCorrect);
  };

  const handleReset = () => {
    if (submitted) return;
    setSelected([]);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center gap-6 px-6 pt-8">
        <p className="text-sm font-medium text-muted-foreground">
          Arrange the words in the correct order
        </p>

        <div
          className={cn(
            "flex min-h-[56px] w-full flex-wrap gap-2 rounded-xl border-2 border-dashed p-3",
            submitted && isCorrect && "border-green-500 bg-green-50 dark:bg-green-500/10",
            submitted && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-500/10",
            !submitted && "border-border",
          )}
        >
          {selectedWords.length === 0 && (
            <span className="text-sm text-muted-foreground/50">Tap words below to build your sentence</span>
          )}
          {selectedWords.map((word, i) => (
            <button
              key={`${selected[i]}-${i}`}
              type="button"
              disabled={submitted}
              onClick={() => handleRemoveWord(i)}
              className={cn(
                "rounded-lg border border-brand/30 bg-brand/10 px-3 py-1.5 text-sm font-medium text-foreground transition-all",
                !submitted && "active:scale-95",
              )}
            >
              {word}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {remaining.map((wordIndex) => (
            <button
              key={wordIndex}
              type="button"
              disabled={submitted}
              onClick={() => handleWordTap(wordIndex)}
              className={cn(
                "rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition-all",
                !submitted && "active:scale-95",
              )}
            >
              {exercise.jumbled_words[wordIndex]}
            </button>
          ))}
        </div>

        {submitted && !isCorrect && (
          <p className="text-sm text-muted-foreground">
            Correct: <span className="font-semibold text-green-600 dark:text-green-400">{exercise.correct_answers[0].join(" ")}</span>
          </p>
        )}

        {!submitted && exercise.hint && (
          <p className="text-sm text-muted-foreground/70">{exercise.hint}</p>
        )}
      </div>

      {!submitted && (
        <div className="flex gap-2 px-4 pb-6 pt-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={selected.length === 0}
            className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-all active:scale-95 disabled:opacity-50"
          >
            Reset
          </button>
          <button
            type="button"
            disabled={selected.length === 0 || disabled}
            onClick={handleSubmit}
            className={cn(
              "flex-1 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-all active:scale-[0.98]",
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

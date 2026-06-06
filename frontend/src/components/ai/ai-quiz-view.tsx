"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { AIQuizViewProps } from "./types";

export function AIQuizView({ data }: AIQuizViewProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    if (revealed[questionIndex]) return;
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleReveal = (questionIndex: number) => {
    setRevealed((prev) => ({ ...prev, [questionIndex]: true }));
  };

  return (
    <div className="space-y-6">
      {data.questions.map((q, qi) => {
        const selected = answers[qi];
        const isRevealed = revealed[qi];
        const isCorrect = selected === q.correct_index;

        return (
          <div key={qi} className="space-y-3">
            <p className="text-sm font-medium">
              {qi + 1}. {q.question}
            </p>
            <div className="grid gap-2">
              {q.options.map((option, oi) => (
                <button
                  key={oi}
                  type="button"
                  onClick={() => handleSelect(qi, oi)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-left text-sm transition-colors",
                    selected === oi && !isRevealed && "border-primary bg-primary/10",
                    isRevealed && oi === q.correct_index && "border-green-500 bg-green-500/10",
                    isRevealed && selected === oi && oi !== q.correct_index && "border-red-500 bg-red-500/10",
                    !isRevealed && "hover:bg-muted/50",
                  )}
                  disabled={isRevealed}
                >
                  {option}
                </button>
              ))}
            </div>
            {selected !== undefined && !isRevealed && (
              <Button size="sm" variant="outline" onClick={() => handleReveal(qi)}>
                Check answer
              </Button>
            )}
            {isRevealed && (
              <div className={cn(
                "rounded-md px-3 py-2 text-sm",
                isCorrect ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-red-500/10 text-red-700 dark:text-red-400",
              )}>
                {isCorrect ? "Correct!" : "Incorrect."} {q.explanation}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

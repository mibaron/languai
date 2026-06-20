"use client";

import { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

import type { MatchingExercise as MatchingExerciseType } from "./types";

interface MatchingExerciseProps {
  exercise: MatchingExerciseType;
  onAnswer: (isCorrect: boolean) => void;
  disabled: boolean;
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function MatchingExercise({
  exercise,
  onAnswer,
  disabled,
}: MatchingExerciseProps) {
  const shuffledRight = useMemo(
    () => shuffleArray(exercise.pairs.map((p) => p.right)),
    [exercise.pairs],
  );

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matches, setMatches] = useState<Map<number, number>>(new Map());
  const [wrongPair, setWrongPair] = useState<[number, number] | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const correctMap = useMemo(() => {
    const m = new Map<number, number>();
    exercise.pairs.forEach((pair, leftIdx) => {
      const rightIdx = shuffledRight.indexOf(pair.right);
      m.set(leftIdx, rightIdx);
    });
    return m;
  }, [exercise.pairs, shuffledRight]);

  const handleLeftTap = useCallback(
    (index: number) => {
      if (submitted || matches.has(index)) return;
      setSelectedLeft(index);
      setWrongPair(null);
    },
    [submitted, matches],
  );

  const handleRightTap = useCallback(
    (rightIndex: number) => {
      if (submitted || selectedLeft === null) return;
      const matchedLefts = new Set(matches.values());
      if (matchedLefts.has(rightIndex)) return;

      const isMatch = correctMap.get(selectedLeft) === rightIndex;
      if (isMatch) {
        const newMatches = new Map(matches);
        newMatches.set(selectedLeft, rightIndex);
        setMatches(newMatches);
        setSelectedLeft(null);
        setWrongPair(null);

        if (newMatches.size === exercise.pairs.length) {
          setSubmitted(true);
          onAnswer(true);
        }
      } else {
        setWrongPair([selectedLeft, rightIndex]);
        setTimeout(() => {
          setWrongPair(null);
          setSelectedLeft(null);
        }, 600);
      }
    },
    [submitted, selectedLeft, matches, correctMap, exercise.pairs.length, onAnswer],
  );

  const matchedRightIndices = new Set(matches.values());

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center gap-6 px-4 pt-8">
        <p className="text-sm font-medium text-muted-foreground">
          {exercise.instruction || "Match the pairs"}
        </p>

        <div className="flex w-full max-w-sm gap-4">
          <div className="flex flex-1 flex-col gap-2">
            {exercise.pairs.map((pair, i) => {
              const isMatched = matches.has(i);
              const isSelected = selectedLeft === i;
              const isWrong = wrongPair?.[0] === i;

              return (
                <button
                  key={`left-${i}`}
                  type="button"
                  disabled={submitted || isMatched || disabled}
                  onClick={() => handleLeftTap(i)}
                  className={cn(
                    "rounded-xl border-2 px-3 py-3 text-sm font-medium transition-all",
                    isMatched && "border-green-500 bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400",
                    isSelected && !isWrong && "border-brand bg-brand/10",
                    isWrong && "border-red-500 bg-red-50 dark:bg-red-500/15",
                    !isMatched && !isSelected && !isWrong && "border-border bg-card",
                  )}
                >
                  {pair.left}
                </button>
              );
            })}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            {shuffledRight.map((text, i) => {
              const isMatched = matchedRightIndices.has(i);
              const isWrong = wrongPair?.[1] === i;

              return (
                <button
                  key={`right-${i}`}
                  type="button"
                  disabled={submitted || isMatched || selectedLeft === null || disabled}
                  onClick={() => handleRightTap(i)}
                  className={cn(
                    "rounded-xl border-2 px-3 py-3 text-sm font-medium transition-all",
                    isMatched && "border-green-500 bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400",
                    isWrong && "border-red-500 bg-red-50 dark:bg-red-500/15",
                    !isMatched && !isWrong && "border-border bg-card",
                  )}
                >
                  {text}
                </button>
              );
            })}
          </div>
        </div>

        {submitted && (
          <p className="text-sm font-semibold text-green-600 dark:text-green-400">
            All matched!
          </p>
        )}
      </div>
    </div>
  );
}

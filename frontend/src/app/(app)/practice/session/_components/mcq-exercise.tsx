"use client";

import { cn } from "@/lib/utils";

import type { MCQExercise as MCQExerciseType } from "@/lib/api/orval/api/generated/model";

interface MCQExerciseProps {
  exercise: MCQExerciseType;
  selectedChoiceId: string | null;
  onSelectChoice: (choiceId: string) => void;
}

export function MCQExercise({
  exercise,
  selectedChoiceId,
  onSelectChoice,
}: MCQExerciseProps) {
  const hasAnswered = selectedChoiceId !== null;

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col items-center gap-2 px-6 pt-12">
        <span className="text-sm font-medium text-muted-foreground">
          Pick the correct answer
        </span>
        <span className="text-center text-2xl font-bold tracking-tight text-foreground">
          {exercise.question}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-3 px-6 pb-8">
        {exercise.choices.map((choice) => {
          const isCorrect = choice.id === exercise.correct_choice_id;
          const isSelected = choice.id === selectedChoiceId;

          let choiceStyle = "border-border bg-card";
          if (hasAnswered) {
            if (isCorrect) {
              choiceStyle = "border-green-500 bg-green-50 dark:bg-green-500/15";
            } else if (isSelected && !isCorrect) {
              choiceStyle = "border-red-500 bg-red-50 dark:bg-red-500/15";
            } else {
              choiceStyle = "border-border bg-card opacity-50";
            }
          }

          return (
            <button
              key={choice.id}
              type="button"
              disabled={hasAnswered}
              onClick={() => onSelectChoice(choice.id)}
              className={cn(
                "w-full rounded-xl border-2 px-5 py-4 text-left text-[16px] font-semibold transition-all",
                choiceStyle,
                !hasAnswered && "active:scale-[0.98]",
              )}
            >
              {choice.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { FlashcardExercise } from "./flashcard-exercise";
import { MCQExercise } from "./mcq-exercise";
import { FillBlankExercise } from "./fill-blank-exercise";
import { SentenceOrderExercise } from "./sentence-order-exercise";
import { ErrorCorrectionExercise } from "./error-correction-exercise";
import { MatchingExercise } from "./matching-exercise";
import type { Exercise } from "./types";

interface ExerciseRendererProps {
  exercise: Exercise;
  isRevealed: boolean;
  selectedChoiceId: string | null;
  disabled: boolean;
  onRevealFlashcard: () => void;
  onRateFlashcard: (rating: number) => void;
  onSelectMCQChoice: (choiceId: string) => void;
  onAnswerExercise: (isCorrect: boolean) => void;
}

export function ExerciseRenderer({
  exercise,
  isRevealed,
  selectedChoiceId,
  disabled,
  onRevealFlashcard,
  onRateFlashcard,
  onSelectMCQChoice,
  onAnswerExercise,
}: ExerciseRendererProps) {
  switch (exercise.exercise_type) {
    case "flashcard":
      return (
        <FlashcardExercise
          exercise={exercise}
          isRevealed={isRevealed}
          onReveal={onRevealFlashcard}
          onRate={onRateFlashcard}
        />
      );
    case "mcq_recognition":
      return (
        <MCQExercise
          exercise={exercise}
          selectedChoiceId={selectedChoiceId}
          onSelectChoice={onSelectMCQChoice}
        />
      );
    case "fill_blank":
      return (
        <FillBlankExercise
          exercise={exercise}
          onAnswer={onAnswerExercise}
          disabled={disabled}
        />
      );
    case "sentence_order":
      return (
        <SentenceOrderExercise
          exercise={exercise}
          onAnswer={onAnswerExercise}
          disabled={disabled}
        />
      );
    case "error_correction":
      return (
        <ErrorCorrectionExercise
          exercise={exercise}
          onAnswer={onAnswerExercise}
          disabled={disabled}
        />
      );
    case "matching":
      return (
        <MatchingExercise
          exercise={exercise}
          onAnswer={onAnswerExercise}
          disabled={disabled}
        />
      );
  }
}

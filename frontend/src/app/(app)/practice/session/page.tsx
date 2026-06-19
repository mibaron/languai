"use client";

import { Suspense } from "react";
import { X } from "lucide-react";

import { usePracticeSession } from "./_hooks/use-practice-session";
import { SessionProgressBar } from "./_components/session-progress-bar";
import { FlashcardExercise } from "./_components/flashcard-exercise";
import { MCQExercise } from "./_components/mcq-exercise";
import { SessionResults } from "./_components/session-results";
import { SessionEmpty } from "./_components/session-empty";

function PracticeSessionContent() {
  const {
    phase,
    mode,
    currentExercise,
    currentIndex,
    totalExercises,
    feedback,
    selectedChoiceId,
    isRevealed,
    isLoading,
    sessionResult,
    submitFlashcardRating,
    revealFlashcard,
    submitMCQAnswer,
    exitSession,
  } = usePracticeSession();

  if (isLoading || phase === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading exercises...</div>
      </div>
    );
  }

  if (phase === "empty") {
    return <SessionEmpty onExit={exitSession} />;
  }

  if (phase === "results") {
    return <SessionResults result={sessionResult} onExit={exitSession} />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between px-4 pt-3">
        <button type="button" onClick={exitSession} className="p-1">
          <X size={22} className="text-muted-foreground" />
        </button>
        <span className="text-sm font-medium capitalize text-muted-foreground">
          {mode === "mcq_recognition" ? "Quiz" : "Flashcards"}
        </span>
        <div className="w-[30px]" />
      </div>

      <SessionProgressBar current={currentIndex} total={totalExercises} />

      {feedback && (
        <div className="px-4">
          <div
            className={
              feedback === "correct"
                ? "rounded-lg bg-green-50 px-4 py-2 text-center text-sm font-semibold text-green-600 dark:bg-green-500/15 dark:text-green-400"
                : "rounded-lg bg-red-50 px-4 py-2 text-center text-sm font-semibold text-red-600 dark:bg-red-500/15 dark:text-red-400"
            }
          >
            {feedback === "correct" ? "Correct!" : "Not quite — keep practicing!"}
          </div>
        </div>
      )}

      {currentExercise?.exercise_type === "flashcard" && (
        <FlashcardExercise
          exercise={currentExercise}
          isRevealed={isRevealed}
          onReveal={revealFlashcard}
          onRate={submitFlashcardRating}
        />
      )}

      {currentExercise?.exercise_type === "mcq_recognition" && (
        <MCQExercise
          exercise={currentExercise}
          selectedChoiceId={selectedChoiceId}
          onSelectChoice={submitMCQAnswer}
        />
      )}
    </div>
  );
}

export default function PracticeSessionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <PracticeSessionContent />
    </Suspense>
  );
}

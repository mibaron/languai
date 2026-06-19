"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useExercisesSessionList,
  getExercisesSessionListQueryKey,
} from "@/lib/api/orval/api/generated/exercises/exercises";
import { useMemoryReviewCreate } from "@/lib/api/orval/api/generated/memory/memory";
import type { ExercisesSessionListExerciseType } from "@/lib/api/orval/api/generated/model";

import type {
  Exercise,
  SessionPhase,
  FeedbackResult,
  SessionResult,
} from "../_components/types";

const FEEDBACK_DELAY_MS = 1200;

export function usePracticeSession() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") ?? "flashcard") as ExercisesSessionListExerciseType;

  const [phase, setPhase] = useState<SessionPhase>("loading");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const correctCount = useRef(0);
  const newItemCount = useRef(0);
  const exerciseStartTime = useRef(Date.now());

  const params = { exercise_type: mode };
  const { data: rawExercises, isLoading, isError } = useExercisesSessionList(
    params,
    {
      query: {
        queryKey: getExercisesSessionListQueryKey(params),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
      },
    },
  );

  const exercises = (rawExercises ?? []) as unknown as Exercise[];

  const reviewMutation = useMemoryReviewCreate();

  if (!isLoading && phase === "loading") {
    if (exercises.length === 0) {
      setPhase("empty");
    } else {
      setPhase("exercise");
      exerciseStartTime.current = Date.now();
      newItemCount.current = exercises.filter((e) => e.is_new).length;
    }
  }

  const currentExercise = exercises[currentIndex] ?? null;
  const progress = exercises.length > 0 ? Math.round((currentIndex / exercises.length) * 100) : 0;

  const submitReview = useCallback(
    (rating: number) => {
      if (!currentExercise) return;
      const responseTime = Date.now() - exerciseStartTime.current;
      reviewMutation.mutate({
        data: {
          item_id: currentExercise.item_id,
          skill_type: currentExercise.skill_type,
          rating,
          response_time_ms: responseTime,
        },
      });
    },
    [currentExercise, reviewMutation],
  );

  const advanceToNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= exercises.length) {
      setPhase("results");
    } else {
      setCurrentIndex(nextIndex);
      setPhase("exercise");
      setFeedback(null);
      setSelectedChoiceId(null);
      setIsRevealed(false);
      exerciseStartTime.current = Date.now();
    }
  }, [currentIndex, exercises.length]);

  const submitFlashcardRating = useCallback(
    (rating: number) => {
      submitReview(rating);
      if (rating >= 3) {
        correctCount.current += 1;
      }
      setFeedback(rating >= 3 ? "correct" : "incorrect");
      setPhase("feedback");
      setTimeout(advanceToNext, FEEDBACK_DELAY_MS);
    },
    [submitReview, advanceToNext],
  );

  const revealFlashcard = useCallback(() => {
    setIsRevealed(true);
  }, []);

  const submitMCQAnswer = useCallback(
    (choiceId: string) => {
      if (!currentExercise || currentExercise.exercise_type !== "mcq_recognition") return;
      setSelectedChoiceId(choiceId);
      const isCorrect = choiceId === currentExercise.correct_choice_id;
      const rating = isCorrect ? 3 : 1;
      submitReview(rating);
      if (isCorrect) {
        correctCount.current += 1;
      }
      setFeedback(isCorrect ? "correct" : "incorrect");
      setPhase("feedback");
      setTimeout(advanceToNext, FEEDBACK_DELAY_MS);
    },
    [currentExercise, submitReview, advanceToNext],
  );

  const exitSession = useCallback(() => {
    router.back();
  }, [router]);

  const sessionResult: SessionResult = {
    total: exercises.length,
    correct: correctCount.current,
    incorrect: exercises.length - correctCount.current,
    newItems: newItemCount.current,
  };

  return {
    phase,
    mode,
    currentExercise,
    currentIndex,
    totalExercises: exercises.length,
    progress,
    feedback,
    selectedChoiceId,
    isRevealed,
    isLoading,
    isError,
    sessionResult,
    submitFlashcardRating,
    revealFlashcard,
    submitMCQAnswer,
    advanceToNext,
    exitSession,
  };
}

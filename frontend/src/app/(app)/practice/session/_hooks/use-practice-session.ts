"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useExercisesStoredSessionList,
  getExercisesStoredSessionListQueryKey,
} from "@/lib/api/orval/api/generated/exercises/exercises";
import { useMemoryReviewCreate } from "@/lib/api/orval/api/generated/memory/memory";
import type {
  ExercisesStoredSessionListExerciseType,
  StoredExercise,
} from "@/lib/api/orval/api/generated/model";

import type {
  Exercise,
  SessionPhase,
  FeedbackResult,
  SessionResult,
} from "../_components/types";

const FEEDBACK_DELAY_MS = 1200;

const MODE_LABELS: Record<string, string> = {
  flashcard: "Flashcards",
  mcq_recognition: "Quiz",
  fill_blank: "Fill in the Blank",
  sentence_order: "Sentence Order",
  error_correction: "Error Correction",
  matching: "Matching",
};

function storedToExercise(stored: StoredExercise): Exercise | null {
  const { exercise_type, item_id, item_text, item_translation, detail } = stored;
  const base = { item_id, skill_type: "recognition" as const, is_new: false };

  switch (exercise_type) {
    case "flashcard": {
      const d = detail as { front_text: string; back_text: string; front_context?: string; back_context?: string };
      return { ...base, exercise_type: "flashcard", front_text: d.front_text, front_hint: d.front_context ?? "", back_text: d.back_text, back_extra: d.back_context ?? "" };
    }
    case "mcq_recognition": {
      const d = detail as { question: string; explanation?: string; choices: { id: string; text: string; is_correct: boolean }[] };
      const correct = d.choices.find((c) => c.is_correct);
      return { ...base, exercise_type: "mcq_recognition", prompt_text: d.question, prompt_hint: item_translation, choices: d.choices.map((c) => ({ id: c.id, text: c.text })), correct_choice_id: correct?.id ?? "" };
    }
    case "fill_blank": {
      const d = detail as { text_before: string; text_after: string; answer: string; accept_alternatives: string[]; hint: string; explanation: string };
      return { ...base, exercise_type: "fill_blank", ...d };
    }
    case "sentence_order": {
      const d = detail as { jumbled_words: string[]; correct_answers: string[][]; hint: string };
      return { ...base, exercise_type: "sentence_order", ...d };
    }
    case "error_correction": {
      const d = detail as { sentence: string; error_start: number; error_end: number; correct_replacement: string; corrected_sentence: string; explanation: string };
      return { ...base, exercise_type: "error_correction", ...d };
    }
    case "matching": {
      const d = detail as { instruction: string; pairs: { left: string; right: string }[] };
      return { ...base, exercise_type: "matching", instruction: d.instruction, pairs: d.pairs };
    }
    default:
      return null;
  }
}

export function usePracticeSession() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") ?? "flashcard") as ExercisesStoredSessionListExerciseType;

  const [phase, setPhase] = useState<SessionPhase>("loading");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const correctCount = useRef(0);
  const newItemCount = useRef(0);
  const exerciseStartTime = useRef(Date.now());

  const params = { exercise_type: mode, max_items: 20 };
  const { data: rawExercises, isLoading, isError } = useExercisesStoredSessionList(
    params,
    {
      query: {
        queryKey: getExercisesStoredSessionListQueryKey(params),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
      },
    },
  );

  const exercises = useMemo(
    () => (rawExercises ?? []).map(storedToExercise).filter((e): e is Exercise => e !== null),
    [rawExercises],
  );

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
  const modeLabel = MODE_LABELS[mode] ?? mode;

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

  const submitExerciseAnswer = useCallback(
    (isCorrect: boolean) => {
      const rating = isCorrect ? 3 : 1;
      submitReview(rating);
      if (isCorrect) {
        correctCount.current += 1;
      }
      setFeedback(isCorrect ? "correct" : "incorrect");
      setPhase("feedback");
      setTimeout(advanceToNext, FEEDBACK_DELAY_MS);
    },
    [submitReview, advanceToNext],
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
    modeLabel,
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
    submitExerciseAnswer,
    advanceToNext,
    exitSession,
  };
}

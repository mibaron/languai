export type { ExerciseSessionItem as Exercise } from "@/lib/api/orval/api/generated/model";

export type SessionPhase = "loading" | "exercise" | "feedback" | "results" | "empty";

export type FeedbackResult = "correct" | "incorrect";

export interface SessionResult {
  total: number;
  correct: number;
  incorrect: number;
}

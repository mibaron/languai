export interface FlashcardExercise {
  exercise_type: "flashcard";
  item_id: string;
  skill_type: string;
  is_new: boolean;
  front_text: string;
  front_hint: string;
  back_text: string;
  back_extra: string;
}

export interface MCQChoice {
  id: string;
  text: string;
}

export interface MCQExercise {
  exercise_type: "mcq_recognition";
  item_id: string;
  skill_type: string;
  is_new: boolean;
  prompt_text: string;
  prompt_hint: string;
  choices: MCQChoice[];
  correct_choice_id: string;
}

export type Exercise = FlashcardExercise | MCQExercise;

export type SessionPhase = "loading" | "exercise" | "feedback" | "results" | "empty";

export type FeedbackResult = "correct" | "incorrect";

export interface SessionResult {
  total: number;
  correct: number;
  incorrect: number;
  newItems: number;
}

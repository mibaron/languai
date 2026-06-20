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

export interface FillBlankExercise {
  exercise_type: "fill_blank";
  item_id: string;
  skill_type: string;
  is_new: boolean;
  text_before: string;
  text_after: string;
  answer: string;
  accept_alternatives: string[];
  hint: string;
  explanation: string;
}

export interface SentenceOrderExercise {
  exercise_type: "sentence_order";
  item_id: string;
  skill_type: string;
  is_new: boolean;
  jumbled_words: string[];
  correct_answers: string[][];
  hint: string;
}

export interface ErrorCorrectionExercise {
  exercise_type: "error_correction";
  item_id: string;
  skill_type: string;
  is_new: boolean;
  sentence: string;
  error_start: number;
  error_end: number;
  correct_replacement: string;
  corrected_sentence: string;
  explanation: string;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface MatchingExercise {
  exercise_type: "matching";
  item_id: string;
  skill_type: string;
  is_new: boolean;
  instruction: string;
  pairs: MatchingPair[];
}

export type Exercise =
  | FlashcardExercise
  | MCQExercise
  | FillBlankExercise
  | SentenceOrderExercise
  | ErrorCorrectionExercise
  | MatchingExercise;

export type SessionPhase = "loading" | "exercise" | "feedback" | "results" | "empty";

export type FeedbackResult = "correct" | "incorrect";

export interface SessionResult {
  total: number;
  correct: number;
  incorrect: number;
  newItems: number;
}

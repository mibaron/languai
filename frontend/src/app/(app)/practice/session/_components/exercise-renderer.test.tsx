import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ExerciseRenderer } from "./exercise-renderer";
import type {
  FlashcardExercise,
  MCQExercise,
  FillBlankExercise,
  SentenceOrderExercise,
  ErrorCorrectionExercise,
  MatchingExercise,
} from "./types";

const baseProps = {
  isRevealed: false,
  selectedChoiceId: null,
  disabled: false,
  onRevealFlashcard: vi.fn(),
  onRateFlashcard: vi.fn(),
  onSelectMCQChoice: vi.fn(),
  onAnswerExercise: vi.fn(),
};

const flashcard: FlashcardExercise = {
  exercise_type: "flashcard",
  item_id: "1",
  skill_type: "recognition",
  is_new: false,
  front_text: "Hund",
  front_hint: "noun",
  back_text: "Dog",
  back_extra: "",
};

const mcq: MCQExercise = {
  exercise_type: "mcq_recognition",
  item_id: "2",
  skill_type: "recognition",
  is_new: false,
  prompt_text: "What is Hund?",
  prompt_hint: "Translate",
  choices: [
    { id: "a", text: "Dog" },
    { id: "b", text: "Cat" },
  ],
  correct_choice_id: "a",
};

const fillBlank: FillBlankExercise = {
  exercise_type: "fill_blank",
  item_id: "3",
  skill_type: "recognition",
  is_new: false,
  text_before: "Ich",
  text_after: "Student.",
  answer: "bin",
  accept_alternatives: [],
  hint: "",
  explanation: "",
};

const sentenceOrder: SentenceOrderExercise = {
  exercise_type: "sentence_order",
  item_id: "4",
  skill_type: "recognition",
  is_new: false,
  jumbled_words: ["bin", "Ich"],
  correct_answers: [["Ich", "bin"]],
  hint: "",
};

const errorCorrection: ErrorCorrectionExercise = {
  exercise_type: "error_correction",
  item_id: "5",
  skill_type: "recognition",
  is_new: false,
  sentence: "Ich bist gut.",
  error_start: 4,
  error_end: 8,
  correct_replacement: "bin",
  corrected_sentence: "Ich bin gut.",
  explanation: "",
};

const matching: MatchingExercise = {
  exercise_type: "matching",
  item_id: "6",
  skill_type: "recognition",
  is_new: false,
  instruction: "Match pairs",
  pairs: [{ left: "Ja", right: "Yes" }],
};

describe("ExerciseRenderer", () => {
  it("renders flashcard exercise", () => {
    render(<ExerciseRenderer {...baseProps} exercise={flashcard} />);
    expect(screen.getByText("Hund")).toBeInTheDocument();
  });

  it("renders MCQ exercise", () => {
    render(<ExerciseRenderer {...baseProps} exercise={mcq} />);
    expect(screen.getByText("What is Hund?")).toBeInTheDocument();
  });

  it("renders fill-blank exercise", () => {
    render(<ExerciseRenderer {...baseProps} exercise={fillBlank} />);
    expect(screen.getByPlaceholderText("Type your answer…")).toBeInTheDocument();
  });

  it("renders sentence-order exercise", () => {
    render(<ExerciseRenderer {...baseProps} exercise={sentenceOrder} />);
    expect(screen.getByText("Arrange the words in the correct order")).toBeInTheDocument();
  });

  it("renders error-correction exercise", () => {
    render(<ExerciseRenderer {...baseProps} exercise={errorCorrection} />);
    expect(screen.getByText("Find and correct the error")).toBeInTheDocument();
  });

  it("renders matching exercise", () => {
    render(<ExerciseRenderer {...baseProps} exercise={matching} />);
    expect(screen.getByText("Match pairs")).toBeInTheDocument();
  });
});

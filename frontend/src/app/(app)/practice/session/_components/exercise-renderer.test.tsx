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
} from "@/lib/api/orval/api/generated/model";

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
  id: "1",
  exercise_type: "flashcard",
  item_id: "1",
  item_text: "Hund",
  item_translation: "Dog",
  front_text: "Hund",
  front_context: "noun",
  back_text: "Dog",
  back_context: "",
};

const mcq: MCQExercise = {
  id: "2",
  exercise_type: "mcq_recognition",
  item_id: "2",
  item_text: "Hund",
  item_translation: "Dog",
  question: "What is Hund?",
  explanation: "",
  choices: [
    { id: "a", text: "Dog" },
    { id: "b", text: "Cat" },
  ],
  correct_choice_id: "a",
};

const fillBlank: FillBlankExercise = {
  id: "3",
  exercise_type: "fill_blank",
  item_id: "3",
  item_text: "Ich bin Student.",
  item_translation: "I am a student.",
  text_before: "Ich",
  text_after: "Student.",
  answer: "bin",
  accept_alternatives: [],
  hint: "",
  explanation: "",
};

const sentenceOrder: SentenceOrderExercise = {
  id: "4",
  exercise_type: "sentence_order",
  item_id: "4",
  item_text: "Ich bin",
  item_translation: "I am",
  jumbled_words: ["bin", "Ich"],
  correct_answers: [["Ich", "bin"]],
  hint: "",
};

const errorCorrection: ErrorCorrectionExercise = {
  id: "5",
  exercise_type: "error_correction",
  item_id: "5",
  item_text: "Ich bin gut.",
  item_translation: "I am good.",
  sentence: "Ich bist gut.",
  error_start: 4,
  error_end: 8,
  correct_replacement: "bin",
  corrected_sentence: "Ich bin gut.",
  explanation: "",
};

const matching: MatchingExercise = {
  id: "6",
  exercise_type: "matching",
  item_id: "6",
  item_text: "Ja",
  item_translation: "Yes",
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

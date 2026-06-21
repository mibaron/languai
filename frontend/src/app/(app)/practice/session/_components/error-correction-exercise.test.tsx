import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ErrorCorrectionExercise } from "./error-correction-exercise";
import type { ErrorCorrectionExercise as ErrorCorrectionExerciseType } from "@/lib/api/orval/api/generated/model";

const mockExercise: ErrorCorrectionExerciseType = {
  id: "ex-1",
  exercise_type: "error_correction",
  item_id: "abc-123",
  item_text: "Ich bin Student.",
  item_translation: "I am a student.",
  sentence: "Ich bist Student.",
  error_start: 4,
  error_end: 8,
  correct_replacement: "bin",
  corrected_sentence: "Ich bin Student.",
  explanation: "Use 'bin' with 'ich'",
};

describe("ErrorCorrectionExercise", () => {
  it("renders the sentence with error highlighted", () => {
    render(<ErrorCorrectionExercise exercise={mockExercise} onAnswer={vi.fn()} disabled={false} />);
    expect(screen.getByText("bist")).toBeInTheDocument();
    expect(screen.getByText("Find and correct the error")).toBeInTheDocument();
  });

  it("shows input with placeholder", () => {
    render(<ErrorCorrectionExercise exercise={mockExercise} onAnswer={vi.fn()} disabled={false} />);
    expect(screen.getByPlaceholderText('Replace "bist" with…')).toBeInTheDocument();
  });

  it("calls onAnswer with true for correct replacement", async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn();
    render(<ErrorCorrectionExercise exercise={mockExercise} onAnswer={onAnswer} disabled={false} />);
    await user.type(screen.getByPlaceholderText('Replace "bist" with…'), "bin");
    await user.click(screen.getByText("Check"));
    expect(onAnswer).toHaveBeenCalledWith(true);
  });

  it("calls onAnswer with false for wrong replacement", async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn();
    render(<ErrorCorrectionExercise exercise={mockExercise} onAnswer={onAnswer} disabled={false} />);
    await user.type(screen.getByPlaceholderText('Replace "bist" with…'), "sind");
    await user.click(screen.getByText("Check"));
    expect(onAnswer).toHaveBeenCalledWith(false);
  });

  it("shows correct answer and explanation when wrong", async () => {
    const user = userEvent.setup();
    render(<ErrorCorrectionExercise exercise={mockExercise} onAnswer={vi.fn()} disabled={false} />);
    await user.type(screen.getByPlaceholderText('Replace "bist" with…'), "sind");
    await user.click(screen.getByText("Check"));
    expect(screen.getByText("bin")).toBeInTheDocument();
    expect(screen.getByText("Use 'bin' with 'ich'")).toBeInTheDocument();
  });

  it("submits on Enter key", async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn();
    render(<ErrorCorrectionExercise exercise={mockExercise} onAnswer={onAnswer} disabled={false} />);
    await user.type(screen.getByPlaceholderText('Replace "bist" with…'), "bin{Enter}");
    expect(onAnswer).toHaveBeenCalledWith(true);
  });

  it("disables check button when input is empty", () => {
    render(<ErrorCorrectionExercise exercise={mockExercise} onAnswer={vi.fn()} disabled={false} />);
    expect(screen.getByText("Check")).toBeDisabled();
  });
});

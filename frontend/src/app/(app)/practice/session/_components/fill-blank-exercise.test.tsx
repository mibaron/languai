import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FillBlankExercise } from "./fill-blank-exercise";
import type { FillBlankExercise as FillBlankExerciseType } from "@/lib/api/orval/api/generated/model";

const mockExercise: FillBlankExerciseType = {
  id: "ex-1",
  exercise_type: "fill_blank",
  item_id: "abc-123",
  item_text: "Können Sie mir helfen?",
  item_translation: "Can you help me?",
  text_before: "Können",
  text_after: "mir helfen?",
  answer: "Sie",
  accept_alternatives: ["sie"],
  hint: "Use the formal form",
  explanation: "Sie is the formal you",
};

describe("FillBlankExercise", () => {
  it("renders text before and after the blank", () => {
    render(<FillBlankExercise exercise={mockExercise} onAnswer={vi.fn()} disabled={false} />);
    expect(screen.getByText(/Können/)).toBeInTheDocument();
    expect(screen.getByText(/mir helfen\?/)).toBeInTheDocument();
  });

  it("shows hint text", () => {
    render(<FillBlankExercise exercise={mockExercise} onAnswer={vi.fn()} disabled={false} />);
    expect(screen.getByText("Use the formal form")).toBeInTheDocument();
  });

  it("shows input and check button", () => {
    render(<FillBlankExercise exercise={mockExercise} onAnswer={vi.fn()} disabled={false} />);
    expect(screen.getByPlaceholderText("Type your answer…")).toBeInTheDocument();
    expect(screen.getByText("Check")).toBeInTheDocument();
  });

  it("calls onAnswer with true for correct answer", async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn();
    render(<FillBlankExercise exercise={mockExercise} onAnswer={onAnswer} disabled={false} />);
    await user.type(screen.getByPlaceholderText("Type your answer…"), "Sie");
    await user.click(screen.getByText("Check"));
    expect(onAnswer).toHaveBeenCalledWith(true);
  });

  it("calls onAnswer with false for incorrect answer", async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn();
    render(<FillBlankExercise exercise={mockExercise} onAnswer={onAnswer} disabled={false} />);
    await user.type(screen.getByPlaceholderText("Type your answer…"), "du");
    await user.click(screen.getByText("Check"));
    expect(onAnswer).toHaveBeenCalledWith(false);
  });

  it("shows correct answer when wrong", async () => {
    const user = userEvent.setup();
    render(<FillBlankExercise exercise={mockExercise} onAnswer={vi.fn()} disabled={false} />);
    await user.type(screen.getByPlaceholderText("Type your answer…"), "du");
    await user.click(screen.getByText("Check"));
    expect(screen.getByText("Sie")).toBeInTheDocument();
  });

  it("accepts alternative answers", async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn();
    render(<FillBlankExercise exercise={mockExercise} onAnswer={onAnswer} disabled={false} />);
    await user.type(screen.getByPlaceholderText("Type your answer…"), "sie");
    await user.click(screen.getByText("Check"));
    expect(onAnswer).toHaveBeenCalledWith(true);
  });

  it("disables check button when input is empty", () => {
    render(<FillBlankExercise exercise={mockExercise} onAnswer={vi.fn()} disabled={false} />);
    expect(screen.getByText("Check")).toBeDisabled();
  });

  it("submits on Enter key", async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn();
    render(<FillBlankExercise exercise={mockExercise} onAnswer={onAnswer} disabled={false} />);
    await user.type(screen.getByPlaceholderText("Type your answer…"), "Sie{Enter}");
    expect(onAnswer).toHaveBeenCalledWith(true);
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SentenceOrderExercise } from "./sentence-order-exercise";
import type { SentenceOrderExercise as SentenceOrderExerciseType } from "@/lib/api/orval/api/generated/model";

const mockExercise: SentenceOrderExerciseType = {
  id: "ex-1",
  exercise_type: "sentence_order",
  item_id: "abc-123",
  item_text: "Ich bin Student",
  item_translation: "I am a student",
  jumbled_words: ["bin", "Ich", "Student"],
  correct_answers: [["Ich", "bin", "Student"]],
  hint: "Subject comes first",
};

describe("SentenceOrderExercise", () => {
  it("renders instruction and all jumbled words", () => {
    render(<SentenceOrderExercise exercise={mockExercise} onAnswer={vi.fn()} disabled={false} />);
    expect(screen.getByText("Arrange the words in the correct order")).toBeInTheDocument();
    expect(screen.getByText("bin")).toBeInTheDocument();
    expect(screen.getByText("Ich")).toBeInTheDocument();
    expect(screen.getByText("Student")).toBeInTheDocument();
  });

  it("shows hint text", () => {
    render(<SentenceOrderExercise exercise={mockExercise} onAnswer={vi.fn()} disabled={false} />);
    expect(screen.getByText("Subject comes first")).toBeInTheDocument();
  });

  it("moves word to sentence area on tap", async () => {
    const user = userEvent.setup();
    render(<SentenceOrderExercise exercise={mockExercise} onAnswer={vi.fn()} disabled={false} />);
    await user.click(screen.getByText("Ich"));
    const ichButtons = screen.getAllByText("Ich");
    expect(ichButtons.length).toBe(1);
  });

  it("calls onAnswer with true for correct order", async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn();
    render(<SentenceOrderExercise exercise={mockExercise} onAnswer={onAnswer} disabled={false} />);
    await user.click(screen.getByText("Ich"));
    await user.click(screen.getByText("bin"));
    await user.click(screen.getByText("Student"));
    await user.click(screen.getByText("Check"));
    expect(onAnswer).toHaveBeenCalledWith(true);
  });

  it("calls onAnswer with false for wrong order", async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn();
    render(<SentenceOrderExercise exercise={mockExercise} onAnswer={onAnswer} disabled={false} />);
    await user.click(screen.getByText("bin"));
    await user.click(screen.getByText("Student"));
    await user.click(screen.getByText("Ich"));
    await user.click(screen.getByText("Check"));
    expect(onAnswer).toHaveBeenCalledWith(false);
  });

  it("shows correct answer when wrong", async () => {
    const user = userEvent.setup();
    render(<SentenceOrderExercise exercise={mockExercise} onAnswer={vi.fn()} disabled={false} />);
    await user.click(screen.getByText("bin"));
    await user.click(screen.getByText("Student"));
    await user.click(screen.getByText("Ich"));
    await user.click(screen.getByText("Check"));
    expect(screen.getByText("Ich bin Student")).toBeInTheDocument();
  });

  it("resets selected words on Reset click", async () => {
    const user = userEvent.setup();
    render(<SentenceOrderExercise exercise={mockExercise} onAnswer={vi.fn()} disabled={false} />);
    await user.click(screen.getByText("Ich"));
    await user.click(screen.getByText("Reset"));
    expect(screen.getByText("Tap words below to build your sentence")).toBeInTheDocument();
  });
});

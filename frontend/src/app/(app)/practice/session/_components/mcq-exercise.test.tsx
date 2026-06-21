import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MCQExercise } from "./mcq-exercise";
import type { MCQExercise as MCQExerciseType } from "@/lib/api/orval/api/generated/model";

const mockExercise: MCQExerciseType = {
  id: "ex-1",
  exercise_type: "mcq_recognition",
  item_id: "abc-123",
  item_text: "der Tisch",
  item_translation: "the table",
  question: "the table",
  explanation: "",
  choices: [
    { id: "c1", text: "der Stuhl" },
    { id: "abc-123", text: "der Tisch" },
    { id: "c3", text: "die Lampe" },
    { id: "c4", text: "das Buch" },
  ],
  correct_choice_id: "abc-123",
};

describe("MCQExercise", () => {
  it("renders prompt text and hint", () => {
    render(
      <MCQExercise
        exercise={mockExercise}
        selectedChoiceId={null}
        onSelectChoice={vi.fn()}
      />,
    );
    expect(screen.getByText("the table")).toBeInTheDocument();
    expect(screen.getByText("Pick the correct answer")).toBeInTheDocument();
  });

  it("renders all four choices", () => {
    render(
      <MCQExercise
        exercise={mockExercise}
        selectedChoiceId={null}
        onSelectChoice={vi.fn()}
      />,
    );
    expect(screen.getByText("der Stuhl")).toBeInTheDocument();
    expect(screen.getByText("der Tisch")).toBeInTheDocument();
    expect(screen.getByText("die Lampe")).toBeInTheDocument();
    expect(screen.getByText("das Buch")).toBeInTheDocument();
  });

  it("calls onSelectChoice when a choice is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <MCQExercise
        exercise={mockExercise}
        selectedChoiceId={null}
        onSelectChoice={onSelect}
      />,
    );
    await user.click(screen.getByText("der Tisch"));
    expect(onSelect).toHaveBeenCalledWith("abc-123");
  });

  it("disables buttons after selection", () => {
    render(
      <MCQExercise
        exercise={mockExercise}
        selectedChoiceId="abc-123"
        onSelectChoice={vi.fn()}
      />,
    );
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it("does not call onSelectChoice when already answered", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <MCQExercise
        exercise={mockExercise}
        selectedChoiceId="abc-123"
        onSelectChoice={onSelect}
      />,
    );
    await user.click(screen.getByText("der Stuhl"));
    expect(onSelect).not.toHaveBeenCalled();
  });
});

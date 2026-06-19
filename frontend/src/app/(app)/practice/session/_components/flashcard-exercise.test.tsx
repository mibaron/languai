import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FlashcardExercise } from "./flashcard-exercise";
import type { FlashcardExercise as FlashcardExerciseType } from "./types";

const mockExercise: FlashcardExerciseType = {
  exercise_type: "flashcard",
  item_id: "abc-123",
  skill_type: "recognition",
  is_new: true,
  front_text: "der Tisch",
  front_hint: "noun",
  back_text: "the table",
  back_extra: "masculine",
};

describe("FlashcardExercise", () => {
  it("shows front text and hint", () => {
    render(
      <FlashcardExercise
        exercise={mockExercise}
        isRevealed={false}
        onReveal={vi.fn()}
        onRate={vi.fn()}
      />,
    );
    expect(screen.getByText("der Tisch")).toBeInTheDocument();
    expect(screen.getByText("noun")).toBeInTheDocument();
  });

  it("shows tap to reveal when not revealed", () => {
    render(
      <FlashcardExercise
        exercise={mockExercise}
        isRevealed={false}
        onReveal={vi.fn()}
        onRate={vi.fn()}
      />,
    );
    expect(screen.getByText("Tap to reveal")).toBeInTheDocument();
    expect(screen.queryByText("the table")).not.toBeInTheDocument();
  });

  it("calls onReveal when card is tapped", async () => {
    const user = userEvent.setup();
    const onReveal = vi.fn();
    render(
      <FlashcardExercise
        exercise={mockExercise}
        isRevealed={false}
        onReveal={onReveal}
        onRate={vi.fn()}
      />,
    );
    await user.click(screen.getByText("der Tisch"));
    expect(onReveal).toHaveBeenCalled();
  });

  it("shows back text and extra when revealed", () => {
    render(
      <FlashcardExercise
        exercise={mockExercise}
        isRevealed={true}
        onReveal={vi.fn()}
        onRate={vi.fn()}
      />,
    );
    expect(screen.getByText("the table")).toBeInTheDocument();
    expect(screen.getByText("masculine")).toBeInTheDocument();
    expect(screen.queryByText("Tap to reveal")).not.toBeInTheDocument();
  });

  it("shows rating buttons when revealed", () => {
    render(
      <FlashcardExercise
        exercise={mockExercise}
        isRevealed={true}
        onReveal={vi.fn()}
        onRate={vi.fn()}
      />,
    );
    expect(screen.getByText("Again")).toBeInTheDocument();
    expect(screen.getByText("Hard")).toBeInTheDocument();
    expect(screen.getByText("Good")).toBeInTheDocument();
    expect(screen.getByText("Easy")).toBeInTheDocument();
  });

  it("does not show rating buttons when not revealed", () => {
    render(
      <FlashcardExercise
        exercise={mockExercise}
        isRevealed={false}
        onReveal={vi.fn()}
        onRate={vi.fn()}
      />,
    );
    expect(screen.queryByText("Again")).not.toBeInTheDocument();
  });

  it("calls onRate with correct rating when button clicked", async () => {
    const user = userEvent.setup();
    const onRate = vi.fn();
    render(
      <FlashcardExercise
        exercise={mockExercise}
        isRevealed={true}
        onReveal={vi.fn()}
        onRate={onRate}
      />,
    );
    await user.click(screen.getByText("Good"));
    expect(onRate).toHaveBeenCalledWith(3);
  });

  it("calls onRate with 1 for Again", async () => {
    const user = userEvent.setup();
    const onRate = vi.fn();
    render(
      <FlashcardExercise
        exercise={mockExercise}
        isRevealed={true}
        onReveal={vi.fn()}
        onRate={onRate}
      />,
    );
    await user.click(screen.getByText("Again"));
    expect(onRate).toHaveBeenCalledWith(1);
  });
});

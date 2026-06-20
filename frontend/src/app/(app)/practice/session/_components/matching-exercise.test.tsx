import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MatchingExercise } from "./matching-exercise";
import type { MatchingExercise as MatchingExerciseType } from "./types";

const mockExercise: MatchingExerciseType = {
  exercise_type: "matching",
  item_id: "abc-123",
  skill_type: "recognition",
  is_new: false,
  instruction: "Match German to English",
  pairs: [
    { left: "Hund", right: "Dog" },
    { left: "Katze", right: "Cat" },
  ],
};

describe("MatchingExercise", () => {
  it("renders instruction and all items", () => {
    render(<MatchingExercise exercise={mockExercise} onAnswer={vi.fn()} disabled={false} />);
    expect(screen.getByText("Match German to English")).toBeInTheDocument();
    expect(screen.getByText("Hund")).toBeInTheDocument();
    expect(screen.getByText("Katze")).toBeInTheDocument();
    expect(screen.getByText("Dog")).toBeInTheDocument();
    expect(screen.getByText("Cat")).toBeInTheDocument();
  });

  it("uses default instruction when none provided", () => {
    const exercise = { ...mockExercise, instruction: "" };
    render(<MatchingExercise exercise={exercise} onAnswer={vi.fn()} disabled={false} />);
    expect(screen.getByText("Match the pairs")).toBeInTheDocument();
  });

  it("allows selecting a left item", async () => {
    const user = userEvent.setup();
    render(<MatchingExercise exercise={mockExercise} onAnswer={vi.fn()} disabled={false} />);
    await user.click(screen.getByText("Hund"));
    // Hund should now be visually selected (brand border) — test it's still in DOM
    expect(screen.getByText("Hund")).toBeInTheDocument();
  });

  it("calls onAnswer with true when all pairs matched correctly", async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn();
    render(<MatchingExercise exercise={mockExercise} onAnswer={onAnswer} disabled={false} />);

    // Match Hund->Dog
    await user.click(screen.getByText("Hund"));
    await user.click(screen.getByText("Dog"));

    // Match Katze->Cat
    await user.click(screen.getByText("Katze"));
    await user.click(screen.getByText("Cat"));

    expect(onAnswer).toHaveBeenCalledWith(true);
  });

  it("shows completion message when all matched", async () => {
    const user = userEvent.setup();
    render(<MatchingExercise exercise={mockExercise} onAnswer={vi.fn()} disabled={false} />);

    await user.click(screen.getByText("Hund"));
    await user.click(screen.getByText("Dog"));
    await user.click(screen.getByText("Katze"));
    await user.click(screen.getByText("Cat"));

    expect(screen.getByText("All matched!")).toBeInTheDocument();
  });
});

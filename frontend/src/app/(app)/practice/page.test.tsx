import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockUseAvailableExerciseTypes = vi.fn();
vi.mock("./_hooks/use-available-exercise-types", () => ({
  useAvailableExerciseTypes: () => mockUseAvailableExerciseTypes(),
}));

import { PracticeTabContent } from "./_components/practice-tab-content";

describe("PracticeTabContent", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockUseAvailableExerciseTypes.mockReturnValue({
      availableTypes: ["flashcard", "mcq_recognition", "fill_blank", "sentence_order", "error_correction", "matching"],
      isLoading: false,
    });
  });

  it("renders all six practice modes", () => {
    render(<PracticeTabContent />);
    expect(screen.getByText("Flashcards")).toBeInTheDocument();
    expect(screen.getByText("Quiz")).toBeInTheDocument();
    expect(screen.getByText("Fill in the Blanks")).toBeInTheDocument();
    expect(screen.getByText("Sentence Order")).toBeInTheDocument();
    expect(screen.getByText("Error Correction")).toBeInTheDocument();
    expect(screen.getByText("Matching")).toBeInTheDocument();
  });

  it("navigates to flashcard session when Flashcards is clicked", async () => {
    const user = userEvent.setup();
    render(<PracticeTabContent />);
    await user.click(screen.getByText("Flashcards"));
    expect(mockPush).toHaveBeenCalledWith("/practice/session?mode=flashcard");
  });

  it("navigates to quiz session when Quiz is clicked", async () => {
    const user = userEvent.setup();
    render(<PracticeTabContent />);
    await user.click(screen.getByText("Quiz"));
    expect(mockPush).toHaveBeenCalledWith("/practice/session?mode=mcq_recognition");
  });

  it("navigates to fill-blank session", async () => {
    const user = userEvent.setup();
    render(<PracticeTabContent />);
    await user.click(screen.getByText("Fill in the Blanks"));
    expect(mockPush).toHaveBeenCalledWith("/practice/session?mode=fill_blank");
  });

  it("navigates to sentence-order session", async () => {
    const user = userEvent.setup();
    render(<PracticeTabContent />);
    await user.click(screen.getByText("Sentence Order"));
    expect(mockPush).toHaveBeenCalledWith("/practice/session?mode=sentence_order");
  });

  it("navigates to error-correction session", async () => {
    const user = userEvent.setup();
    render(<PracticeTabContent />);
    await user.click(screen.getByText("Error Correction"));
    expect(mockPush).toHaveBeenCalledWith("/practice/session?mode=error_correction");
  });

  it("navigates to matching session", async () => {
    const user = userEvent.setup();
    render(<PracticeTabContent />);
    await user.click(screen.getByText("Matching"));
    expect(mockPush).toHaveBeenCalledWith("/practice/session?mode=matching");
  });

  it("disables modes with no exercises on studied pages", async () => {
    mockUseAvailableExerciseTypes.mockReturnValue({
      availableTypes: ["flashcard"],
      isLoading: false,
    });
    const user = userEvent.setup();
    render(<PracticeTabContent />);

    const flashcardBtn = screen.getByText("Flashcards").closest("button");
    const quizBtn = screen.getByText("Quiz").closest("button");
    expect(flashcardBtn).not.toBeDisabled();
    expect(quizBtn).toBeDisabled();

    await user.click(screen.getByText("Flashcards"));
    expect(mockPush).toHaveBeenCalledWith("/practice/session?mode=flashcard");

    mockPush.mockClear();
    await user.click(screen.getByText("Quiz"));
    expect(mockPush).not.toHaveBeenCalled();
  });
});

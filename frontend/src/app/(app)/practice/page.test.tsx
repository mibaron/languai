import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

import { PracticeTabContent } from "./_components/practice-tab-content";

describe("PracticeTabContent", () => {
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
    mockPush.mockClear();
    render(<PracticeTabContent />);
    await user.click(screen.getByText("Quiz"));
    expect(mockPush).toHaveBeenCalledWith("/practice/session?mode=mcq_recognition");
  });

  it("navigates to fill-blank session", async () => {
    const user = userEvent.setup();
    mockPush.mockClear();
    render(<PracticeTabContent />);
    await user.click(screen.getByText("Fill in the Blanks"));
    expect(mockPush).toHaveBeenCalledWith("/practice/session?mode=fill_blank");
  });

  it("navigates to sentence-order session", async () => {
    const user = userEvent.setup();
    mockPush.mockClear();
    render(<PracticeTabContent />);
    await user.click(screen.getByText("Sentence Order"));
    expect(mockPush).toHaveBeenCalledWith("/practice/session?mode=sentence_order");
  });

  it("navigates to error-correction session", async () => {
    const user = userEvent.setup();
    mockPush.mockClear();
    render(<PracticeTabContent />);
    await user.click(screen.getByText("Error Correction"));
    expect(mockPush).toHaveBeenCalledWith("/practice/session?mode=error_correction");
  });

  it("navigates to matching session", async () => {
    const user = userEvent.setup();
    mockPush.mockClear();
    render(<PracticeTabContent />);
    await user.click(screen.getByText("Matching"));
    expect(mockPush).toHaveBeenCalledWith("/practice/session?mode=matching");
  });
});

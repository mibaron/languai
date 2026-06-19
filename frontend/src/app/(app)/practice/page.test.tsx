import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

import { PracticeTabContent } from "./_components/practice-tab-content";

describe("PracticeTabContent", () => {
  it("renders all four practice modes", () => {
    render(<PracticeTabContent />);
    expect(screen.getByText("Flashcards")).toBeInTheDocument();
    expect(screen.getByText("Quiz")).toBeInTheDocument();
    expect(screen.getByText("Fill in the Blanks")).toBeInTheDocument();
    expect(screen.getByText("Mock Exam")).toBeInTheDocument();
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
    expect(mockPush).toHaveBeenCalledWith(
      "/practice/session?mode=mcq_recognition",
    );
  });

  it("disables Fill in the Blanks and Mock Exam", () => {
    render(<PracticeTabContent />);
    const fillBtn = screen.getByText("Fill in the Blanks").closest("button");
    const examBtn = screen.getByText("Mock Exam").closest("button");
    expect(fillBtn).toBeDisabled();
    expect(examBtn).toBeDisabled();
  });

  it("does not navigate when disabled mode is clicked", async () => {
    const user = userEvent.setup();
    mockPush.mockClear();
    render(<PracticeTabContent />);
    await user.click(screen.getByText("Fill in the Blanks"));
    expect(mockPush).not.toHaveBeenCalled();
  });
});

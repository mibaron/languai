import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SessionResults } from "./session-results";
import type { SessionResult } from "./types";

const mockResult: SessionResult = {
  total: 10,
  correct: 7,
  incorrect: 3,
};

describe("SessionResults", () => {
  it("renders score percentage", () => {
    render(<SessionResults result={mockResult} onExit={vi.fn()} />);
    expect(screen.getByText("70%")).toBeInTheDocument();
  });

  it("renders correct and incorrect counts", () => {
    render(<SessionResults result={mockResult} onExit={vi.fn()} />);
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders session complete text", () => {
    render(<SessionResults result={mockResult} onExit={vi.fn()} />);
    expect(screen.getByText("Session Complete")).toBeInTheDocument();
    expect(screen.getByText("7 of 10 correct")).toBeInTheDocument();
  });

  it("calls onExit when Done is clicked", async () => {
    const user = userEvent.setup();
    const onExit = vi.fn();
    render(<SessionResults result={mockResult} onExit={onExit} />);
    await user.click(screen.getByText("Done"));
    expect(onExit).toHaveBeenCalled();
  });
});

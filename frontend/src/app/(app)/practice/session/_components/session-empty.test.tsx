import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SessionEmpty } from "./session-empty";

describe("SessionEmpty", () => {
  it("renders empty state message", () => {
    render(<SessionEmpty onExit={vi.fn()} />);
    expect(screen.getByText("Nothing to review")).toBeInTheDocument();
    expect(
      screen.getByText(
        "You're all caught up! Check back later or add new packs to keep learning.",
      ),
    ).toBeInTheDocument();
  });

  it("calls onExit when Go back is clicked", async () => {
    const user = userEvent.setup();
    const onExit = vi.fn();
    render(<SessionEmpty onExit={onExit} />);
    await user.click(screen.getByText("Go back"));
    expect(onExit).toHaveBeenCalled();
  });
});

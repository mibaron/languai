import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { UserPackSubscription } from "@/lib/api/orval/api/generated/model";

import { PackActionSheet } from "./pack-action-sheet";

const mockSubscription: UserPackSubscription = {
  id: "sub-1",
  pack: {
    id: "pack-1",
    title: "German A1.1",
    slug: "a1-1-en",
    level_code: "A1.1",
    base_language: "English",
    description: "Test pack",
    grammar_count: 10,
    vocab_count: 20,
    exercise_count: 5,
    subscriber_count: 1,
  },
  status: "active",
  created_at: "2026-01-01T00:00:00Z",
};

describe("PackActionSheet", () => {
  it("renders nothing when subscription is null", () => {
    const { container } = render(
      <PackActionSheet
        subscription={null}
        onClose={vi.fn()}
        onArchive={vi.fn()}
        onUnsubscribe={vi.fn()}
        onResetProgress={vi.fn()}
      />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders pack title and actions", () => {
    render(
      <PackActionSheet
        subscription={mockSubscription}
        onClose={vi.fn()}
        onArchive={vi.fn()}
        onUnsubscribe={vi.fn()}
        onResetProgress={vi.fn()}
      />,
    );
    expect(screen.getByText("German A1.1")).toBeInTheDocument();
    expect(screen.getByText("Mark as Complete")).toBeInTheDocument();
    expect(screen.getByText("Reset Progress")).toBeInTheDocument();
    expect(screen.getByText("Archive Pack")).toBeInTheDocument();
    expect(screen.getByText("Unsubscribe")).toBeInTheDocument();
  });

  it("calls onArchive and onClose when Archive is clicked", async () => {
    const user = userEvent.setup();
    const onArchive = vi.fn();
    const onClose = vi.fn();
    render(
      <PackActionSheet
        subscription={mockSubscription}
        onClose={onClose}
        onArchive={onArchive}
        onUnsubscribe={vi.fn()}
        onResetProgress={vi.fn()}
      />,
    );
    await user.click(screen.getByText("Archive Pack"));
    expect(onArchive).toHaveBeenCalledWith("pack-1");
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onUnsubscribe and onClose when Unsubscribe is clicked", async () => {
    const user = userEvent.setup();
    const onUnsubscribe = vi.fn();
    const onClose = vi.fn();
    render(
      <PackActionSheet
        subscription={mockSubscription}
        onClose={onClose}
        onArchive={vi.fn()}
        onUnsubscribe={onUnsubscribe}
        onResetProgress={vi.fn()}
      />,
    );
    await user.click(screen.getByText("Unsubscribe"));
    expect(onUnsubscribe).toHaveBeenCalledWith("pack-1");
    expect(onClose).toHaveBeenCalled();
  });

  it("shows confirm dialog and calls onResetProgress when confirmed", async () => {
    const user = userEvent.setup();
    const onResetProgress = vi.fn();
    const onClose = vi.fn();
    render(
      <PackActionSheet
        subscription={mockSubscription}
        onClose={onClose}
        onArchive={vi.fn()}
        onUnsubscribe={vi.fn()}
        onResetProgress={onResetProgress}
      />,
    );
    await user.click(screen.getByText("Reset Progress"));
    expect(screen.getByText("Reset")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(onResetProgress).toHaveBeenCalledWith("pack-1");
    expect(onClose).toHaveBeenCalled();
  });
});

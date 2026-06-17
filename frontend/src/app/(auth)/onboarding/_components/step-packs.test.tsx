import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { Pack } from "@/lib/api/orval/api/generated/model";

import { StepPacks } from "./step-packs";

const mockPacks: Pack[] = [
  {
    id: "pack-1",
    title: "A1.1 German (EN)",
    slug: "a11-en",
    level_code: "A1.1",
    base_language: "en",
    description: "Beginner German for English speakers.",
    grammar_count: 15,
    vocab_count: 10,
    exercise_count: 25,
    subscriber_count: 42,
  },
  {
    id: "pack-2",
    title: "A1.2 German (EN)",
    slug: "a12-en",
    level_code: "A1.2",
    base_language: "en",
    description: "Intermediate beginner German.",
    grammar_count: 20,
    vocab_count: 15,
    exercise_count: 30,
    subscriber_count: 18,
  },
];

describe("StepPacks", () => {
  const defaultProps = {
    packs: mockPacks,
    selectedPackIds: [] as string[],
    onToggle: vi.fn(),
    isLoading: false,
  };

  it("renders heading and description", () => {
    render(<StepPacks {...defaultProps} />);
    expect(screen.getByText("Pick your first pack")).toBeInTheDocument();
    expect(screen.getByText(/Curated sets of grammar/)).toBeInTheDocument();
  });

  it("renders all pack cards", () => {
    render(<StepPacks {...defaultProps} />);
    expect(screen.getByText("A1.1 German (EN)")).toBeInTheDocument();
    expect(screen.getByText("A1.2 German (EN)")).toBeInTheDocument();
  });

  it("shows pack stats", () => {
    render(<StepPacks {...defaultProps} />);
    expect(screen.getByText("15 grammar")).toBeInTheDocument();
    expect(screen.getByText("10 vocab")).toBeInTheDocument();
    expect(screen.getByText("25 exercises")).toBeInTheDocument();
  });

  it("calls onToggle when a pack is clicked", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<StepPacks {...defaultProps} onToggle={onToggle} />);

    await user.click(screen.getByText("A1.1 German (EN)"));
    expect(onToggle).toHaveBeenCalledWith("pack-1");
  });

  it("shows loading skeleton when loading", () => {
    const { container } = render(<StepPacks {...defaultProps} isLoading />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons).toHaveLength(3);
  });

  it("does not render pack cards when loading", () => {
    render(<StepPacks {...defaultProps} isLoading />);
    expect(screen.queryByText("A1.1 German (EN)")).not.toBeInTheDocument();
  });
});

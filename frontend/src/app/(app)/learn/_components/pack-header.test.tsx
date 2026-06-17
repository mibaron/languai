import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Pack } from "@/lib/api/orval/api/generated/model";

import { PackHeader } from "./pack-header";

const mockPack: Pack = {
  id: "test-id",
  title: "German A1.1",
  slug: "a1-1-en",
  level_code: "A1.1",
  base_language: "English",
  description: "Test pack",
  grammar_count: 10,
  vocab_count: 20,
  exercise_count: 5,
  subscriber_count: 1,
};

describe("PackHeader", () => {
  it("renders pack title and base language", () => {
    render(
      <PackHeader
        activePack={mockPack}
        overallProgress={42}
        onOpenPackDrawer={vi.fn()}
        onOpenStats={vi.fn()}
      />,
    );
    expect(screen.getByText("German A1.1")).toBeInTheDocument();
    expect(screen.getByText("in English")).toBeInTheDocument();
  });

  it("shows fallback text when no pack selected", () => {
    render(
      <PackHeader
        activePack={null}
        overallProgress={0}
        onOpenPackDrawer={vi.fn()}
        onOpenStats={vi.fn()}
      />,
    );
    expect(screen.getByText("Select a pack")).toBeInTheDocument();
  });

  it("shows progress ring with percentage", () => {
    render(
      <PackHeader
        activePack={mockPack}
        overallProgress={42}
        onOpenPackDrawer={vi.fn()}
        onOpenStats={vi.fn()}
      />,
    );
    expect(screen.getByText("42%")).toBeInTheDocument();
  });

  it("calls onOpenPackDrawer when pack button is clicked", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(
      <PackHeader
        activePack={mockPack}
        overallProgress={0}
        onOpenPackDrawer={onOpen}
        onOpenStats={vi.fn()}
      />,
    );
    await user.click(screen.getByText("German A1.1"));
    expect(onOpen).toHaveBeenCalled();
  });
});

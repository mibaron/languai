import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { SectionItem } from "@/types/content";

import { SectionNotes } from "./section-notes";

const items: SectionItem[] = [
  { order: 0, cells: ["Rule one: always capitalize nouns"] },
  { order: 1, cells: ["─── Divider ───"] },
  { order: 2, cells: ["Rule two: verb goes second"] },
];

const baseProps = {
  items,
  sectionTitle: "Grammar Rules",
  levelCode: "A1.1",
  category: "grammar",
};

describe("SectionNotes", () => {
  it("renders all note items", () => {
    render(<SectionNotes {...baseProps} />);
    expect(
      screen.getByText("Rule one: always capitalize nouns"),
    ).toBeInTheDocument();
    expect(screen.getByText("Rule two: verb goes second")).toBeInTheDocument();
  });

  it("note items are not clickable in normal mode", async () => {
    const onExplainItem = vi.fn();
    render(<SectionNotes {...baseProps} onExplainItem={onExplainItem} />);
    await userEvent
      .setup()
      .click(screen.getByText("Rule one: always capitalize nouns"));
    expect(onExplainItem).not.toHaveBeenCalled();
  });

  it("note items are clickable in explain mode", async () => {
    const user = userEvent.setup();
    const onExplainItem = vi.fn();
    render(
      <SectionNotes
        {...baseProps}
        explainMode={true}
        onExplainItem={onExplainItem}
      />,
    );
    await user.click(screen.getByText("Rule one: always capitalize nouns"));
    expect(onExplainItem).toHaveBeenCalledWith({
      levelCode: "A1.1",
      category: "grammar",
      sectionTitle: "Grammar Rules",
      itemOrder: 0,
      itemCells: ["Rule one: always capitalize nouns"],
    });
  });

  it("dividers are not clickable in explain mode", async () => {
    const user = userEvent.setup();
    const onExplainItem = vi.fn();
    render(
      <SectionNotes
        {...baseProps}
        explainMode={true}
        onExplainItem={onExplainItem}
      />,
    );
    await user.click(screen.getByText("─── Divider ───"));
    expect(onExplainItem).not.toHaveBeenCalled();
  });
});

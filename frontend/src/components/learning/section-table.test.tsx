import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { SectionItem } from "@/types/content";

import { SectionTable } from "./section-table";

const headers = ["German", "English"];
const items: SectionItem[] = [
  { order: 0, cells: ["ich", "I"] },
  { order: 1, cells: ["du", "you"] },
];

const baseProps = {
  headers,
  items,
  sectionTitle: "Personal Pronouns",
  levelCode: "A1.1",
  category: "grammar",
};

describe("SectionTable", () => {
  it("renders headers and rows", () => {
    render(<SectionTable {...baseProps} />);
    expect(screen.getByText("German")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("ich")).toBeInTheDocument();
    expect(screen.getByText("du")).toBeInTheDocument();
  });

  it("rows are not clickable in normal mode", async () => {
    const onExplainItem = vi.fn();
    render(<SectionTable {...baseProps} onExplainItem={onExplainItem} />);
    await userEvent.setup().click(screen.getByText("ich"));
    expect(onExplainItem).not.toHaveBeenCalled();
  });

  it("rows are clickable in explain mode", async () => {
    const user = userEvent.setup();
    const onExplainItem = vi.fn();
    render(
      <SectionTable
        {...baseProps}
        explainMode={true}
        onExplainItem={onExplainItem}
      />,
    );
    await user.click(screen.getByText("ich"));
    expect(onExplainItem).toHaveBeenCalledWith({
      levelCode: "A1.1",
      category: "grammar",
      sectionTitle: "Personal Pronouns",
      sectionHeaders: ["German", "English"],
      itemOrder: 0,
      itemCells: ["ich", "I"],
    });
  });

  it("rows have highlight styling in explain mode", () => {
    const { container } = render(
      <SectionTable {...baseProps} explainMode={true} />,
    );
    const rows = container.querySelectorAll("tbody tr");
    expect(rows[0]?.className).toContain("ring-brand/30");
    expect(rows[0]?.className).toContain("cursor-pointer");
  });
});

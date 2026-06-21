import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { SectionList } from "@/lib/api/orval/api/generated/model";

import { SectionCard } from "./section-card";

const tableSection: SectionList = {
  id: "1",
  level_code: "A1.1",
  category: "grammar",
  title: "Personal Pronouns",
  order: 0,
  content_type: "table",
  item_count: 2,
};

const gridSection: SectionList = {
  id: "2",
  level_code: "A1.1",
  category: "vocab",
  title: "Greetings",
  order: 0,
  content_type: "grid",
  item_count: 5,
};

describe("SectionCard", () => {
  it("renders section title", () => {
    render(<SectionCard section={tableSection} onOpen={vi.fn()} />);
    expect(screen.getByText("Personal Pronouns")).toBeInTheDocument();
  });

  it("shows item count with correct label for table type", () => {
    render(<SectionCard section={tableSection} onOpen={vi.fn()} />);
    expect(screen.getByText("2 rows")).toBeInTheDocument();
  });

  it("shows item count with correct label for grid type", () => {
    render(<SectionCard section={gridSection} onOpen={vi.fn()} />);
    expect(screen.getByText("5 words")).toBeInTheDocument();
  });

  it("calls onOpen when clicked", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(<SectionCard section={tableSection} onOpen={onOpen} />);
    await user.click(screen.getByText("Personal Pronouns"));
    expect(onOpen).toHaveBeenCalledWith(tableSection);
  });
});

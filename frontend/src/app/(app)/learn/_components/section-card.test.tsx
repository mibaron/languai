import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Section } from "@/types/content";

import { SectionCard } from "./section-card";

const tableSection: Section = {
  title: "Personal Pronouns",
  type: "table",
  headers: ["Pronoun", "English"],
  items: [
    { order: 0, cells: ["ich", "I"] },
    { order: 1, cells: ["du", "you"] },
  ],
};

const gridSection: Section = {
  title: "Greetings",
  type: "grid",
  items: Array.from({ length: 5 }, (_, i) => ({
    order: i,
    cells: ["hello", "hallo"],
  })),
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

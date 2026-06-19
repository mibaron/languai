import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { Section } from "@/types/content";

vi.mock("@/components/learning/section-card", () => ({
  SectionCard: ({
    section,
    levelCode,
    category,
  }: {
    section: Section;
    levelCode: string;
    category: string;
  }) => (
    <div data-testid="section-content">
      <span data-testid="content-title">{section.title}</span>
      <span data-testid="content-level">{levelCode}</span>
      <span data-testid="content-category">{category}</span>
    </div>
  ),
}));

import { SectionDetailView } from "./section-detail-view";

const mockSection: Section = {
  title: "Personal Pronouns — Nominativ",
  type: "table",
  headers: ["Pronomen", "English"],
  items: [
    { order: 0, cells: ["ich", "I"] },
    { order: 1, cells: ["du", "you"] },
  ],
};

const defaultProps = {
  section: mockSection,
  sectionIndex: 1,
  totalSections: 5,
  levelCode: "A1.1",
  category: "grammar",
  onBack: vi.fn(),
  onNavigate: vi.fn(),
};

describe("SectionDetailView", () => {
  it("renders header with position counter", () => {
    render(<SectionDetailView {...defaultProps} />);
    expect(screen.getByText("2 of 5")).toBeInTheDocument();
  });

  it("renders section content with correct props", () => {
    render(<SectionDetailView {...defaultProps} />);
    expect(screen.getByTestId("content-title")).toHaveTextContent(
      "Personal Pronouns — Nominativ",
    );
    expect(screen.getByTestId("content-level")).toHaveTextContent("A1.1");
    expect(screen.getByTestId("content-category")).toHaveTextContent("grammar");
  });

  it("calls onBack when back button is clicked", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(<SectionDetailView {...defaultProps} onBack={onBack} />);
    await user.click(screen.getByRole("button", { name: /back to sections/i }));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it("calls onNavigate with previous index when prev is clicked", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<SectionDetailView {...defaultProps} onNavigate={onNavigate} />);
    await user.click(
      screen.getByRole("button", { name: /previous section/i }),
    );
    expect(onNavigate).toHaveBeenCalledWith(0);
  });

  it("calls onNavigate with next index when next is clicked", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<SectionDetailView {...defaultProps} onNavigate={onNavigate} />);
    await user.click(screen.getByRole("button", { name: /next section/i }));
    expect(onNavigate).toHaveBeenCalledWith(2);
  });

  it("disables prev button on first section", () => {
    render(<SectionDetailView {...defaultProps} sectionIndex={0} />);
    expect(
      screen.getByRole("button", { name: /previous section/i }),
    ).toBeDisabled();
  });

  it("disables next button on last section", () => {
    render(<SectionDetailView {...defaultProps} sectionIndex={4} />);
    expect(
      screen.getByRole("button", { name: /next section/i }),
    ).toBeDisabled();
  });
});

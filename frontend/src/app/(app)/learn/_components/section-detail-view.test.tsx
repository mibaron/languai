import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { SectionDetail } from "@/lib/api/orval/api/generated/model";

const mockSectionDetail: SectionDetail = {
  id: "sec-1",
  level: "level-1",
  level_code: "A1.1",
  category: "grammar",
  title: "Personal Pronouns — Nominativ",
  order: 0,
  content_type: "table",
  note: "",
  note2: "",
  headers: ["Pronomen", "English"],
  items: [
    { id: "item-1", order: 0, cells: ["ich", "I"] },
    { id: "item-2", order: 1, cells: ["du", "you"] },
  ],
  created_by: "admin",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

vi.mock("@/lib/api/orval/api/generated/sections/sections", () => ({
  useSectionsRetrieve: () => ({
    data: mockSectionDetail,
    isLoading: false,
  }),
}));

vi.mock("@/components/learning/section-card", () => ({
  SectionCard: ({
    section,
    levelCode,
    category,
  }: {
    section: { title: string };
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

vi.mock("@/contexts/explain-mode-context", () => ({
  useExplainModeContext: () => ({
    explainMode: false,
    isExplaining: false,
    triggerExplain: vi.fn(),
    setHasExplainableContent: vi.fn(),
  }),
}));

import { SectionDetailView } from "./section-detail-view";

const defaultProps = {
  sectionId: "sec-1",
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

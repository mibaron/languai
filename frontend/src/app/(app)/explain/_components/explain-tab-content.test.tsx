import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ExplainModeContextValue } from "@/types/explain-mode";
import type { AIContent } from "@/lib/api/orval/api/generated/model";

const mockCtx: ExplainModeContextValue = {
  explainMode: false,
  hasExplainableContent: false,
  setHasExplainableContent: vi.fn(),
  enterExplainMode: vi.fn(),
  exitExplainMode: vi.fn(),
  explainItem: null,
  explainContent: null,
  isExplaining: false,
  error: null,
  triggerExplain: vi.fn(),
};

vi.mock("@/contexts/explain-mode-context", () => ({
  useExplainModeContext: () => mockCtx,
}));

vi.mock("@/components/ai/ai-explanation-view", () => ({
  AIExplanationView: ({ data }: { data: { explanation: string } }) => (
    <div data-testid="explanation-view">{data.explanation}</div>
  ),
}));

import { ExplainTabContent } from "./explain-tab-content";

describe("ExplainTabContent", () => {
  beforeEach(() => {
    mockCtx.explainItem = null;
    mockCtx.explainContent = null;
    mockCtx.isExplaining = false;
    mockCtx.error = null;
  });

  it("shows empty state when no content", () => {
    render(<ExplainTabContent />);
    expect(
      screen.getByText(/open a section in learn/i),
    ).toBeInTheDocument();
  });

  it("shows loading state when explaining", () => {
    mockCtx.isExplaining = true;
    mockCtx.explainItem = {
      levelCode: "A1.1",
      category: "grammar",
      sectionTitle: "Pronouns",
      itemOrder: 0,
      itemCells: ["ich", "I"],
    };
    render(<ExplainTabContent />);
    expect(screen.getByText("Generating explanation...")).toBeInTheDocument();
    expect(screen.getByText("ich · I")).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockCtx.error = "Failed to generate explanation. Please try again.";
    render(<ExplainTabContent />);
    expect(
      screen.getByText("Failed to generate explanation. Please try again."),
    ).toBeInTheDocument();
  });

  it("renders explanation content when available", () => {
    mockCtx.explainItem = {
      levelCode: "A1.1",
      category: "grammar",
      sectionTitle: "Pronouns",
      itemOrder: 0,
      itemCells: ["ich", "I"],
    };
    mockCtx.explainContent = [
      {
        id: "1",
        action_type: "explanation",
        level_code: "A1.1",
        category: "grammar",
        section_title: "Pronouns",
        item_cells: ["ich", "I"],
        section_headers: [],
        response_text: "Explanation text",
        response_json: {
          title: "Ich",
          explanation: "First person singular pronoun",
          key_points: [],
          common_mistakes: [],
        },
        model_used: "test-model",
        is_saved: false,
        created_at: "2026-01-01",
      } as AIContent,
    ];
    render(<ExplainTabContent />);
    expect(screen.getByText("Pronouns")).toBeInTheDocument();
    expect(screen.getByTestId("explanation-view")).toHaveTextContent(
      "First person singular pronoun",
    );
  });

  it("shows model name on explanation", () => {
    mockCtx.explainItem = {
      levelCode: "A1.1",
      category: "grammar",
      sectionTitle: "Pronouns",
      itemOrder: 0,
      itemCells: ["ich", "I"],
    };
    mockCtx.explainContent = [
      {
        id: "1",
        action_type: "explanation",
        level_code: "A1.1",
        category: "grammar",
        section_title: "Pronouns",
        item_cells: ["ich", "I"],
        section_headers: [],
        response_text: "Text",
        response_json: {
          title: "Ich",
          explanation: "Pronoun",
          key_points: [],
          common_mistakes: [],
        },
        model_used: "openai/gpt-4o",
        is_saved: false,
        created_at: "2026-01-01",
      } as AIContent,
    ];
    render(<ExplainTabContent />);
    expect(screen.getByText("gpt-4o")).toBeInTheDocument();
  });
});

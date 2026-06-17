import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CategoryTabs } from "./category-tabs";

describe("CategoryTabs", () => {
  it("renders all four category tabs", () => {
    render(
      <CategoryTabs activeCategory="grammar" onCategoryChange={vi.fn()} />,
    );
    expect(screen.getByText("Grammar")).toBeInTheDocument();
    expect(screen.getByText("Vocabulary")).toBeInTheDocument();
    expect(screen.getByText("Verbs")).toBeInTheDocument();
    expect(screen.getByText("Phrases")).toBeInTheDocument();
  });

  it("highlights the active category", () => {
    render(
      <CategoryTabs activeCategory="verbs" onCategoryChange={vi.fn()} />,
    );
    const verbsTab = screen.getByText("Verbs");
    expect(verbsTab.className).toContain("border-brand");
    expect(verbsTab.className).toContain("font-bold");
  });

  it("calls onCategoryChange when a tab is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CategoryTabs activeCategory="grammar" onCategoryChange={onChange} />,
    );
    await user.click(screen.getByText("Vocabulary"));
    expect(onChange).toHaveBeenCalledWith("vocab");
  });
});

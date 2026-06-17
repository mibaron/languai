import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BottomTabBar } from "./bottom-tab-bar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/learn",
}));

describe("BottomTabBar", () => {
  it("renders all four tabs", () => {
    render(<BottomTabBar />);
    expect(screen.getByText("Learn")).toBeInTheDocument();
    expect(screen.getByText("Explain")).toBeInTheDocument();
    expect(screen.getByText("Practice")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("renders tabs as links to correct routes", () => {
    render(<BottomTabBar />);
    expect(screen.getByText("Learn").closest("a")).toHaveAttribute(
      "href",
      "/learn",
    );
    expect(screen.getByText("Explain").closest("a")).toHaveAttribute(
      "href",
      "/explain",
    );
    expect(screen.getByText("Practice").closest("a")).toHaveAttribute(
      "href",
      "/practice",
    );
    expect(screen.getByText("Profile").closest("a")).toHaveAttribute(
      "href",
      "/profile",
    );
  });

  it("applies active styling to current route", () => {
    render(<BottomTabBar />);
    const learnLink = screen.getByText("Learn").closest("a");
    expect(learnLink?.className).toContain("text-brand");
  });

  it("applies inactive styling to non-current routes", () => {
    render(<BottomTabBar />);
    const explainLink = screen.getByText("Explain").closest("a");
    expect(explainLink?.className).toContain("text-muted-foreground");
  });
});

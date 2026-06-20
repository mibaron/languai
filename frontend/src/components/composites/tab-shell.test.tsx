import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { TabShellContextValue } from "@/types/tab-shell";

const mockContextValue: TabShellContextValue = {
  activeTab: "learn",
  switchTab: vi.fn(),
  isSubRoute: false,
};

vi.mock("@/contexts/tab-shell-context", () => ({
  useTabShellContext: () => mockContextValue,
}));

vi.mock("@/app/(app)/learn/_components/learn-tab-content", () => ({
  LearnTabContent: () => <div data-testid="learn-tab">Learn Content</div>,
}));

vi.mock("@/app/(app)/explain/_components/explain-tab-content", () => ({
  ExplainTabContent: () => (
    <div data-testid="explain-tab">Explain Content</div>
  ),
}));

vi.mock("@/app/(app)/practice/_components/practice-tab-content", () => ({
  PracticeTabContent: () => (
    <div data-testid="practice-tab">Practice Content</div>
  ),
}));

vi.mock("@/app/(app)/profile/_components/profile-tab-content", () => ({
  ProfileTabContent: () => (
    <div data-testid="profile-tab">Profile Content</div>
  ),
}));

import { TabShell } from "./tab-shell";

describe("TabShell", () => {
  it("renders all four tab contents", () => {
    render(<TabShell>child</TabShell>);
    expect(screen.getByTestId("learn-tab")).toBeInTheDocument();
    expect(screen.getByTestId("explain-tab")).toBeInTheDocument();
    expect(screen.getByTestId("practice-tab")).toBeInTheDocument();
    expect(screen.getByTestId("profile-tab")).toBeInTheDocument();
  });

  it("only shows the active tab", () => {
    mockContextValue.activeTab = "learn";
    render(<TabShell>child</TabShell>);
    const learnDiv = screen.getByTestId("learn-tab").parentElement;
    const explainDiv = screen.getByTestId("explain-tab").parentElement;
    expect(learnDiv?.style.display).toBe("flex");
    expect(explainDiv?.style.display).toBe("none");
  });

  it("shows children and hides tabs when on a sub-route", () => {
    mockContextValue.isSubRoute = true;
    render(<TabShell><div data-testid="sub-route">Sub Route</div></TabShell>);
    expect(screen.getByTestId("sub-route")).toBeInTheDocument();
    const learnDiv = screen.getByTestId("learn-tab").parentElement;
    expect(learnDiv?.style.display).toBe("none");
    mockContextValue.isSubRoute = false;
  });
});

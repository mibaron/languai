import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { TabShellContextValue } from "@/types/tab-shell";
import type { ExplainModeContextValue } from "@/types/explain-mode";

const mockSwitchTab = vi.fn();
const mockEnterExplainMode = vi.fn();
const mockExitExplainMode = vi.fn();

const tabShellValue: TabShellContextValue = {
  activeTab: "learn",
  switchTab: mockSwitchTab,
  isSubRoute: false,
};

const explainModeValue: ExplainModeContextValue = {
  explainMode: false,
  hasExplainableContent: true,
  setHasExplainableContent: vi.fn(),
  enterExplainMode: mockEnterExplainMode,
  exitExplainMode: mockExitExplainMode,
  explainItem: null,
  explainContent: null,
  isExplaining: false,
  error: null,
  triggerExplain: vi.fn(),
};

vi.mock("@/contexts/tab-shell-context", () => ({
  useTabShellContext: () => tabShellValue,
}));

vi.mock("@/contexts/explain-mode-context", () => ({
  useExplainModeContext: () => explainModeValue,
}));

import { BottomTabBar } from "./bottom-tab-bar";

describe("BottomTabBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tabShellValue.activeTab = "learn";
    explainModeValue.explainMode = false;
    explainModeValue.hasExplainableContent = true;
    explainModeValue.isExplaining = false;
  });

  it("renders all four tabs", () => {
    render(<BottomTabBar />);
    expect(screen.getByText("Learn")).toBeInTheDocument();
    expect(screen.getByText("Explain")).toBeInTheDocument();
    expect(screen.getByText("Practice")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("renders tabs as buttons", () => {
    render(<BottomTabBar />);
    expect(screen.getByText("Learn").closest("button")).toBeInTheDocument();
    expect(screen.getByText("Practice").closest("button")).toBeInTheDocument();
  });

  it("applies active styling to current tab", () => {
    render(<BottomTabBar />);
    const learnBtn = screen.getByText("Learn").closest("button");
    expect(learnBtn?.className).toContain("text-brand");
  });

  it("applies inactive styling to non-current tabs", () => {
    render(<BottomTabBar />);
    const practiceBtn = screen.getByText("Practice").closest("button");
    expect(practiceBtn?.className).toContain("text-muted-foreground");
  });

  it("calls switchTab when a regular tab is clicked", async () => {
    const user = userEvent.setup();
    render(<BottomTabBar />);
    await user.click(screen.getByText("Practice"));
    expect(mockSwitchTab).toHaveBeenCalledWith("practice");
  });

  it("enters explain mode on first Explain tab click", async () => {
    const user = userEvent.setup();
    render(<BottomTabBar />);
    await user.click(screen.getByText("Explain"));
    expect(mockEnterExplainMode).toHaveBeenCalledOnce();
    expect(mockSwitchTab).not.toHaveBeenCalled();
  });

  it("switches to explain tab on second Explain click (already in explain mode)", async () => {
    const user = userEvent.setup();
    explainModeValue.explainMode = true;
    render(<BottomTabBar />);
    await user.click(screen.getByText("Explain"));
    expect(mockSwitchTab).toHaveBeenCalledWith("explain");
  });

  it("exits explain mode when switching to another tab", async () => {
    const user = userEvent.setup();
    explainModeValue.explainMode = true;
    render(<BottomTabBar />);
    await user.click(screen.getByText("Profile"));
    expect(mockExitExplainMode).toHaveBeenCalledOnce();
    expect(mockSwitchTab).toHaveBeenCalledWith("profile");
  });

  it("switches to explain tab when no explainable content", async () => {
    const user = userEvent.setup();
    explainModeValue.hasExplainableContent = false;
    render(<BottomTabBar />);
    await user.click(screen.getByText("Explain"));
    expect(mockEnterExplainMode).not.toHaveBeenCalled();
    expect(mockSwitchTab).toHaveBeenCalledWith("explain");
  });

  it("disables tabs while explaining", () => {
    explainModeValue.isExplaining = true;
    render(<BottomTabBar />);
    const learnBtn = screen.getByText("Learn").closest("button");
    expect(learnBtn).toBeDisabled();
  });
});

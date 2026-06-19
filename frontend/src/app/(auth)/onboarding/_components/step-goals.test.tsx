import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { LearningGoal } from "@/lib/api/orval/api/generated/model";

import { StepGoals } from "./step-goals";

const mockGoals: LearningGoal[] = [
  {
    id: "goal-1",
    name: "Exam Preparation",
    slug: "exam",
    description: "Prepare for Goethe/TestDaF exams",
    icon: "graduation-cap",
    order: 1,
  },
  {
    id: "goal-2",
    name: "Living in Germany",
    slug: "living",
    description: "Daily life and integration",
    icon: "home",
    order: 2,
  },
  {
    id: "goal-3",
    name: "Working in Germany",
    slug: "working",
    description: "Professional German for the workplace",
    icon: "briefcase",
    order: 3,
  },
];

describe("StepGoals", () => {
  const defaultProps = {
    goals: mockGoals,
    selectedGoalId: null as string | null,
    onSelect: vi.fn(),
    isLoading: false,
  };

  it("renders heading and description", () => {
    render(<StepGoals {...defaultProps} />);
    expect(screen.getByText("What's your goal?")).toBeInTheDocument();
    expect(
      screen.getByText("This helps us tailor your learning experience."),
    ).toBeInTheDocument();
  });

  it("renders all goals", () => {
    render(<StepGoals {...defaultProps} />);
    expect(screen.getByText("Exam Preparation")).toBeInTheDocument();
    expect(screen.getByText("Living in Germany")).toBeInTheDocument();
    expect(screen.getByText("Working in Germany")).toBeInTheDocument();
  });

  it("renders goal descriptions", () => {
    render(<StepGoals {...defaultProps} />);
    expect(
      screen.getByText("Prepare for Goethe/TestDaF exams"),
    ).toBeInTheDocument();
  });

  it("calls onSelect when a goal is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<StepGoals {...defaultProps} onSelect={onSelect} />);

    await user.click(screen.getByText("Exam Preparation"));
    expect(onSelect).toHaveBeenCalledWith("goal-1");
  });

  it("shows loading spinner when loading", () => {
    const { container } = render(<StepGoals {...defaultProps} isLoading />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("does not render goals when loading", () => {
    render(<StepGoals {...defaultProps} isLoading />);
    expect(screen.queryByText("Exam Preparation")).not.toBeInTheDocument();
  });
});

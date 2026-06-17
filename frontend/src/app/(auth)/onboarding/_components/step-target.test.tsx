import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { StepTarget } from "./step-target";

describe("StepTarget", () => {
  it("renders heading and description", () => {
    render(<StepTarget />);
    expect(screen.getByText("What do you want to learn?")).toBeInTheDocument();
    expect(screen.getByText(/German is available now/)).toBeInTheDocument();
  });

  it("shows German as the only available language", () => {
    const { container } = render(<StepTarget />);
    expect(screen.getByText("German")).toBeInTheDocument();
    const germanCard = screen.getByText("German").closest("[class*='rounded']");
    expect(germanCard?.className).toContain("border-brand");
  });

  it("renders all four target languages", () => {
    render(<StepTarget />);
    expect(screen.getByText("German")).toBeInTheDocument();
    expect(screen.getByText("Spanish")).toBeInTheDocument();
    expect(screen.getByText("French")).toBeInTheDocument();
    expect(screen.getByText("Italian")).toBeInTheDocument();
  });

  it("shows coming soon for unavailable languages", () => {
    render(<StepTarget />);
    const comingSoon = screen.getAllByText("Coming soon");
    expect(comingSoon).toHaveLength(3);
  });
});

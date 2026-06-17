import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { StepLanguage } from "./step-language";

describe("StepLanguage", () => {
  const defaultProps = {
    selectedLanguages: ["en"],
    primaryLanguage: "en",
    onToggle: vi.fn(),
  };

  it("renders the heading and description", () => {
    render(<StepLanguage {...defaultProps} />);
    expect(screen.getByText("What language do you speak?")).toBeInTheDocument();
    expect(screen.getByText(/Select up to 3/)).toBeInTheDocument();
  });

  it("renders all four language options", () => {
    render(<StepLanguage {...defaultProps} />);
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Persian")).toBeInTheDocument();
    expect(screen.getByText("Turkish")).toBeInTheDocument();
    expect(screen.getByText("Arabic")).toBeInTheDocument();
  });

  it("calls onToggle when a language is clicked", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<StepLanguage {...defaultProps} onToggle={onToggle} />);

    await user.click(screen.getByText("Persian"));
    expect(onToggle).toHaveBeenCalledWith("fa");
  });

  it("shows primary language label when multiple selected", () => {
    render(
      <StepLanguage
        selectedLanguages={["en", "fa"]}
        primaryLanguage="en"
        onToggle={vi.fn()}
      />,
    );
    expect(screen.getByText("Primary language")).toBeInTheDocument();
  });

  it("does not show primary label when only one language selected", () => {
    render(<StepLanguage {...defaultProps} />);
    expect(screen.queryByText("Primary language")).not.toBeInTheDocument();
  });
});

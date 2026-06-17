import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProgressHeader } from "./progress-header";

describe("ProgressHeader", () => {
  it("renders step counter", () => {
    render(<ProgressHeader currentStep={2} totalSteps={3} onBack={vi.fn()} />);
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("shows back button on step 2+", () => {
    render(<ProgressHeader currentStep={2} totalSteps={3} onBack={vi.fn()} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("hides back button on step 1", () => {
    render(<ProgressHeader currentStep={1} totalSteps={3} onBack={vi.fn()} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onBack when back button clicked", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(<ProgressHeader currentStep={2} totalSteps={3} onBack={onBack} />);

    await user.click(screen.getByRole("button"));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it("renders progress bar with correct width", () => {
    const { container } = render(
      <ProgressHeader currentStep={2} totalSteps={3} onBack={vi.fn()} />,
    );
    const bar = container.querySelector("[style]");
    expect(bar).toHaveStyle({ width: `${(2 / 3) * 100}%` });
  });
});

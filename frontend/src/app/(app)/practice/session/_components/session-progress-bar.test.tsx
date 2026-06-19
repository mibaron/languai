import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SessionProgressBar } from "./session-progress-bar";

describe("SessionProgressBar", () => {
  it("renders current and total count", () => {
    render(<SessionProgressBar current={3} total={10} />);
    expect(screen.getByText("3/10")).toBeInTheDocument();
  });

  it("renders 0/0 when no exercises", () => {
    render(<SessionProgressBar current={0} total={0} />);
    expect(screen.getByText("0/0")).toBeInTheDocument();
  });

  it("sets progress bar width based on percentage", () => {
    const { container } = render(<SessionProgressBar current={5} total={10} />);
    const bar = container.querySelector("[style]");
    expect(bar).toHaveStyle({ width: "50%" });
  });
});

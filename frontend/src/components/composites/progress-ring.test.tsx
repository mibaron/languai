import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProgressRing } from "./progress-ring";

describe("ProgressRing", () => {
  it("renders the percentage value", () => {
    render(<ProgressRing value={75} />);
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("renders SVG circles", () => {
    const { container } = render(<ProgressRing value={50} />);
    const circles = container.querySelectorAll("circle");
    expect(circles).toHaveLength(2);
  });

  it("applies custom size", () => {
    const { container } = render(<ProgressRing value={50} size={80} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "80");
    expect(svg).toHaveAttribute("height", "80");
  });
});

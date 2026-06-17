import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PasswordStrengthBar } from "./password-strength-bar";

describe("PasswordStrengthBar", () => {
  it("renders nothing when password is empty", () => {
    const { container } = render(<PasswordStrengthBar password="" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders 4 bar segments", () => {
    const { container } = render(<PasswordStrengthBar password="abcdefgh" />);
    const bars = container.querySelectorAll(".rounded-full");
    expect(bars).toHaveLength(4);
  });

  it("shows Weak label for weak password", () => {
    render(<PasswordStrengthBar password="abcdefgh" />);
    expect(screen.getByText("Weak")).toBeInTheDocument();
  });

  it("shows Strong label for strong password", () => {
    render(<PasswordStrengthBar password="Abcdefghij1!" />);
    expect(screen.getByText("Strong")).toBeInTheDocument();
  });

  it("fills correct number of bars for score 2", () => {
    const { container } = render(
      <PasswordStrengthBar password="abcdefghijkl" />,
    );
    const bars = container.querySelectorAll(".rounded-full");
    const filledBars = Array.from(bars).filter(
      (bar) => !bar.classList.contains("bg-border"),
    );
    expect(filledBars).toHaveLength(2);
  });
});

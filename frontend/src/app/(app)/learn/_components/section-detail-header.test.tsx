import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SectionDetailHeader } from "./section-detail-header";

const defaultProps = {
  title: "Personal Pronouns — Nominativ",
  sectionIndex: 2,
  totalSections: 10,
  onBack: vi.fn(),
  onPrev: vi.fn(),
  onNext: vi.fn(),
  hasPrev: true,
  hasNext: true,
};

describe("SectionDetailHeader", () => {
  it("renders section title", () => {
    render(<SectionDetailHeader {...defaultProps} />);
    expect(
      screen.getByText("Personal Pronouns — Nominativ"),
    ).toBeInTheDocument();
  });

  it("renders position counter", () => {
    render(<SectionDetailHeader {...defaultProps} />);
    expect(screen.getByText("3 of 10")).toBeInTheDocument();
  });

  it("calls onBack when back button is clicked", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(<SectionDetailHeader {...defaultProps} onBack={onBack} />);
    await user.click(screen.getByRole("button", { name: /back to sections/i }));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it("calls onPrev when previous button is clicked", async () => {
    const user = userEvent.setup();
    const onPrev = vi.fn();
    render(<SectionDetailHeader {...defaultProps} onPrev={onPrev} />);
    await user.click(
      screen.getByRole("button", { name: /previous section/i }),
    );
    expect(onPrev).toHaveBeenCalledOnce();
  });

  it("calls onNext when next button is clicked", async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    render(<SectionDetailHeader {...defaultProps} onNext={onNext} />);
    await user.click(screen.getByRole("button", { name: /next section/i }));
    expect(onNext).toHaveBeenCalledOnce();
  });

  it("disables previous button when hasPrev is false", () => {
    render(<SectionDetailHeader {...defaultProps} hasPrev={false} />);
    expect(
      screen.getByRole("button", { name: /previous section/i }),
    ).toBeDisabled();
  });

  it("disables next button when hasNext is false", () => {
    render(<SectionDetailHeader {...defaultProps} hasNext={false} />);
    expect(
      screen.getByRole("button", { name: /next section/i }),
    ).toBeDisabled();
  });
});

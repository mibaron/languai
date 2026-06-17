import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LanguageDrawer } from "./language-drawer";

describe("LanguageDrawer", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <LanguageDrawer
        open={false}
        mode="speaks"
        currentValue="en"
        onSave={vi.fn()}
        onClose={vi.fn()}
        isSaving={false}
      />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders speaks mode with correct title", () => {
    render(
      <LanguageDrawer
        open={true}
        mode="speaks"
        currentValue="en"
        onSave={vi.fn()}
        onClose={vi.fn()}
        isSaving={false}
      />,
    );
    expect(screen.getByText("I Speak")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("renders learning mode with correct title", () => {
    render(
      <LanguageDrawer
        open={true}
        mode="learning"
        currentValue="de"
        onSave={vi.fn()}
        onClose={vi.fn()}
        isSaving={false}
      />,
    );
    expect(screen.getByText("I'm Learning")).toBeInTheDocument();
  });

  it("calls onSave with selected language", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(
      <LanguageDrawer
        open={true}
        mode="speaks"
        currentValue="en"
        onSave={onSave}
        onClose={vi.fn()}
        isSaving={false}
      />,
    );
    await user.click(screen.getByText("German"));
    await user.click(screen.getByText("Save"));
    expect(onSave).toHaveBeenCalledWith("de");
  });

  it("disables save when same value is selected", () => {
    render(
      <LanguageDrawer
        open={true}
        mode="speaks"
        currentValue="en"
        onSave={vi.fn()}
        onClose={vi.fn()}
        isSaving={false}
      />,
    );
    expect(screen.getByText("Save")).toBeDisabled();
  });
});

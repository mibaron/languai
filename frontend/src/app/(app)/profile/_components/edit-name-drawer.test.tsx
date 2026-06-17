import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { EditNameDrawer } from "./edit-name-drawer";

describe("EditNameDrawer", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <EditNameDrawer
        open={false}
        firstName="John"
        lastName="Doe"
        onSave={vi.fn()}
        onClose={vi.fn()}
        isSaving={false}
      />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders form with current name when open", () => {
    render(
      <EditNameDrawer
        open={true}
        firstName="John"
        lastName="Doe"
        onSave={vi.fn()}
        onClose={vi.fn()}
        isSaving={false}
      />,
    );
    expect(screen.getByText("Edit Name")).toBeInTheDocument();
    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
  });

  it("calls onSave with updated names", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(
      <EditNameDrawer
        open={true}
        firstName=""
        lastName=""
        onSave={onSave}
        onClose={vi.fn()}
        isSaving={false}
      />,
    );
    await user.type(screen.getByPlaceholderText("First name"), "Jane");
    await user.type(screen.getByPlaceholderText("Last name"), "Smith");
    await user.click(screen.getByText("Save"));
    expect(onSave).toHaveBeenCalledWith("Jane", "Smith");
  });

  it("calls onClose when cancel is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <EditNameDrawer
        open={true}
        firstName="John"
        lastName="Doe"
        onSave={vi.fn()}
        onClose={onClose}
        isSaving={false}
      />,
    );
    await user.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });
});

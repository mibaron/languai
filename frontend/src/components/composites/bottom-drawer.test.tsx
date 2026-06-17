import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { BottomDrawer } from "./bottom-drawer";

describe("BottomDrawer", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <BottomDrawer open={false} onClose={vi.fn()}>
        <div>Content</div>
      </BottomDrawer>,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders children when open", () => {
    render(
      <BottomDrawer open={true} onClose={vi.fn()}>
        <div>Drawer Content</div>
      </BottomDrawer>,
    );
    expect(screen.getByText("Drawer Content")).toBeInTheDocument();
  });

  it("calls onClose when backdrop is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = render(
      <BottomDrawer open={true} onClose={onClose}>
        <div>Content</div>
      </BottomDrawer>,
    );
    const backdrop = container.firstChild as HTMLElement;
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it("does not call onClose when drawer content is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <BottomDrawer open={true} onClose={onClose}>
        <button>Inner Button</button>
      </BottomDrawer>,
    );
    await user.click(screen.getByText("Inner Button"));
    expect(onClose).not.toHaveBeenCalled();
  });
});

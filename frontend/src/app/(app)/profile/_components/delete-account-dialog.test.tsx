import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DeleteAccountDialog } from "./delete-account-dialog";

describe("DeleteAccountDialog", () => {
  it("renders dialog when open", () => {
    render(
      <DeleteAccountDialog
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        isLoading={false}
      />,
    );
    expect(screen.getByText("Delete Account")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("delete")).toBeInTheDocument();
  });

  it("disables confirm button until user types delete", async () => {
    const user = userEvent.setup();
    render(
      <DeleteAccountDialog
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        isLoading={false}
      />,
    );
    const confirmBtn = screen.getByText("Delete My Account");
    expect(confirmBtn).toBeDisabled();

    await user.type(screen.getByPlaceholderText("delete"), "delete");
    expect(confirmBtn).toBeEnabled();
  });

  it("calls onConfirm when confirmed", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <DeleteAccountDialog
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={onConfirm}
        isLoading={false}
      />,
    );
    await user.type(screen.getByPlaceholderText("delete"), "delete");
    await user.click(screen.getByText("Delete My Account"));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("accepts case-insensitive delete", async () => {
    const user = userEvent.setup();
    render(
      <DeleteAccountDialog
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        isLoading={false}
      />,
    );
    await user.type(screen.getByPlaceholderText("delete"), "DELETE");
    expect(screen.getByText("Delete My Account")).toBeEnabled();
  });
});

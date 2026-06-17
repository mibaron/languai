"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import type { DeleteAccountDialogProps } from "./types";

function DeleteAccountForm({
  onOpenChange,
  onConfirm,
  isLoading,
}: Omit<DeleteAccountDialogProps, "open">) {
  const [confirmation, setConfirmation] = useState("");
  const isConfirmed = confirmation.toLowerCase() === "delete";

  return (
    <>
      <DialogHeader>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogDescription>
          This action is permanent and cannot be undone. All your data,
          progress, and saved content will be permanently deleted.
        </DialogDescription>
      </DialogHeader>

      <div className="py-2">
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Type <span className="font-bold text-red-500">delete</span> to
          confirm
        </label>
        <input
          type="text"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-red-500"
          placeholder="delete"
          autoComplete="off"
        />
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenChange(false)}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onConfirm}
          disabled={!isConfirmed || isLoading}
        >
          {isLoading ? "Deleting..." : "Delete My Account"}
        </Button>
      </DialogFooter>
    </>
  );
}

export function DeleteAccountDialog({
  open,
  ...formProps
}: DeleteAccountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={formProps.onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        {open && <DeleteAccountForm {...formProps} />}
      </DialogContent>
    </Dialog>
  );
}

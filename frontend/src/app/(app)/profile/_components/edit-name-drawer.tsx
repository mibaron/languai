"use client";

import { useState } from "react";

import { BottomDrawer } from "@/components/composites/bottom-drawer";

import type { EditNameDrawerProps } from "./types";

function EditNameForm({
  firstName,
  lastName,
  onSave,
  onClose,
  isSaving,
}: Omit<EditNameDrawerProps, "open">) {
  const [first, setFirst] = useState(firstName);
  const [last, setLast] = useState(lastName);

  const handleSave = () => {
    onSave(first.trim(), last.trim());
  };

  return (
    <>
      <div className="px-4 pb-2">
        <h3 className="text-base font-semibold text-foreground">Edit Name</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          This name will be shown in your profile
        </p>
      </div>

      <div className="flex flex-col gap-3 px-4 py-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            First Name
          </label>
          <input
            type="text"
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-brand"
            placeholder="First name"
            autoFocus
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Last Name
          </label>
          <input
            type="text"
            value={last}
            onChange={(e) => setLast(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Last name"
          />
        </div>
      </div>

      <div className="flex gap-3 px-4 pb-4 pt-2">
        <button
          onClick={onClose}
          disabled={isSaving}
          className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving || (!first.trim() && !last.trim())}
          className="flex-1 rounded-lg bg-brand py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}

export function EditNameDrawer({
  open,
  ...formProps
}: EditNameDrawerProps) {
  return (
    <BottomDrawer open={open} onClose={formProps.onClose}>
      {open && <EditNameForm {...formProps} />}
    </BottomDrawer>
  );
}

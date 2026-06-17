"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { BottomDrawer } from "@/components/composites/bottom-drawer";
import { useAuthChangePasswordCreate } from "@/lib/api/orval/api/generated/auth/auth";
import { setUserToken } from "@/lib/utils/auth/cookie-utils";

import type { ChangePasswordDrawerProps } from "./types";

export function ChangePasswordDrawer({
  open,
  onClose,
}: ChangePasswordDrawerProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const mutation = useAuthChangePasswordCreate();

  const handleClose = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess(false);
    onClose();
  };

  const handleSubmit = () => {
    setError("");

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    mutation.mutate(
      { data: { old_password: oldPassword, new_password: newPassword } },
      {
        onSuccess: (data) => {
          const response = data as unknown as { token: string };
          if (response.token) {
            setUserToken(response.token);
          }
          setSuccess(true);
          setTimeout(handleClose, 1500);
        },
        onError: () => {
          setError("Current password is incorrect");
        },
      },
    );
  };

  const isValid =
    oldPassword.length > 0 &&
    newPassword.length >= 8 &&
    confirmPassword === newPassword;

  return (
    <BottomDrawer open={open} onClose={handleClose}>
      <div className="px-4 pb-2">
        <h3 className="text-base font-semibold text-foreground">
          Change Password
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Enter your current password and choose a new one
        </p>
      </div>

      {success ? (
        <div className="px-4 py-6 text-center text-sm text-green-500">
          Password changed successfully!
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 px-4 py-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showOld ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 pr-10 text-sm text-foreground outline-none focus:border-brand"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 pr-10 text-sm text-foreground outline-none focus:border-brand"
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-brand"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
          </div>

          <div className="flex gap-3 px-4 pb-4 pt-2">
            <button
              onClick={handleClose}
              disabled={mutation.isPending}
              className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValid || mutation.isPending}
              className="flex-1 rounded-lg bg-brand py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {mutation.isPending ? "Changing..." : "Change Password"}
            </button>
          </div>
        </>
      )}
    </BottomDrawer>
  );
}

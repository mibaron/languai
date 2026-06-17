"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authResetPasswordCreate } from "@/lib/api/orval/api/generated/auth/auth";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid") ?? "";
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!uid || !token) {
    return (
      <div>
        <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-destructive/10">
          <AlertCircle size={24} className="text-destructive" />
        </div>
        <h1 className="mb-2 text-[28px] font-[800] tracking-[-0.03em]">
          Invalid link
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          This password reset link is invalid or has expired.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await authResetPasswordCreate({
        uid,
        token,
        new_password: newPassword,
      });
      setSuccess(true);
    } catch {
      setError("This reset link is invalid or has expired. Please request a new one.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div>
        <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-green-500/10">
          <CheckCircle size={24} className="text-green-500" />
        </div>
        <h1 className="mb-2 text-[28px] font-[800] tracking-[-0.03em]">
          Password reset!
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Your password has been changed. You can now sign in with your new
          password.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
        >
          <ArrowLeft size={14} />
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-2 text-[28px] font-[800] tracking-[-0.03em]">
        Reset password
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Choose a new password for your account.
      </p>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-[10px] border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-[13px] text-destructive">
          <AlertCircle className="size-[15px] shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="new-password" className="text-[13px] font-medium">
            New Password
          </Label>
          <Input
            id="new-password"
            type="password"
            placeholder="Min. 8 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
            autoFocus
            className="rounded-[11px] border-[1.5px] px-3.5 py-2.5 text-sm transition-all focus:border-brand focus:ring-3 focus:ring-brand/10"
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="confirm-password"
            className="text-[13px] font-medium"
          >
            Confirm Password
          </Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="rounded-[11px] border-[1.5px] px-3.5 py-2.5 text-sm transition-all focus:border-brand focus:ring-3 focus:ring-brand/10"
          />
        </div>

        <Button
          type="submit"
          className="w-full rounded-xl bg-brand py-3 text-[15px] font-semibold hover:bg-brand-hover"
          disabled={isLoading || !newPassword || !confirmPassword}
        >
          {isLoading ? "Resetting..." : "Reset password"}
          {!isLoading && <ArrowRight className="ml-2 size-4" />}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Suspense>
        <ResetPasswordContent />
      </Suspense>
    </AuthLayout>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";

import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authForgotPasswordCreate } from "@/lib/api/orval/api/generated/auth/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authForgotPasswordCreate({ email });
      setSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {sent ? (
        <div>
          <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-brand-muted">
            <Mail size={24} className="text-brand" />
          </div>
          <h1 className="mb-2 text-[28px] font-[800] tracking-[-0.03em]">
            Check your email
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            If an account with <strong className="text-foreground">{email}</strong> exists,
            we&apos;ve sent a link to reset your password.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
          >
            <ArrowLeft size={14} />
            Back to sign in
          </Link>
        </div>
      ) : (
        <div>
          <h1 className="mb-2 text-[28px] font-[800] tracking-[-0.03em]">
            Forgot password?
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[13px] font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
                className="rounded-[11px] border-[1.5px] px-3.5 py-2.5 text-sm transition-all focus:border-brand focus:ring-3 focus:ring-brand/10"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl bg-brand py-3 text-[15px] font-semibold hover:bg-brand-hover"
              disabled={isLoading || !email}
            >
              {isLoading ? "Sending..." : "Send reset link"}
              {!isLoading && <ArrowRight className="ml-2 size-4" />}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-medium text-brand hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      )}
    </AuthLayout>
  );
}

"use client";

import { AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authRegisterCreate } from "@/lib/api/orval/api/generated/auth/auth";
import { getAuthErrorMessage } from "@/lib/utils/auth/error-utils";
import { setUserToken } from "@/lib/utils/auth/cookie-utils";

import { GoogleSignInButton } from "./google-sign-in-button";
import { PasswordStrengthBar } from "./password-strength-bar";
import type { RegisterFormProps, RegisterFormState } from "./types";

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [state, setState] = useState<RegisterFormState>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    error: null,
    isLoading: false,
  });

  const handleGoogleSuccess = useCallback(
    (token: string) => onSuccess(token),
    [onSuccess],
  );

  const handleGoogleError = useCallback(
    (error: string) => setState((prev) => ({ ...prev, error })),
    [],
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (state.password !== state.confirmPassword) {
      setState((prev) => ({ ...prev, error: "Passwords do not match" }));
      return;
    }

    setState((prev) => ({ ...prev, error: null, isLoading: true }));

    try {
      const response = await authRegisterCreate({
        username: state.username,
        email: state.email,
        password: state.password,
      });
      setUserToken(response.token);
      onSuccess(response.token);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: getAuthErrorMessage(error),
        isLoading: false,
      }));
    }
  };

  const isFormValid =
    state.username && state.email && state.password && state.confirmPassword;

  return (
    <div>
      <Link
        href="/login"
        className="mb-8 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to sign in
      </Link>

      <div className="mb-8">
        <h1 className="mb-2 text-[28px] font-[800] tracking-[-0.03em]">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Free forever. No credit card required.
        </p>
      </div>

      {state.error && (
        <div className="mb-4 flex items-center gap-2 rounded-[10px] border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-[13px] text-destructive">
          <AlertCircle className="size-[15px] shrink-0" />
          {state.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="username" className="text-[13px] font-medium">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="Choose a username"
            value={state.username}
            onChange={(e) =>
              setState((prev) => ({ ...prev, username: e.target.value }))
            }
            required
            autoComplete="username"
            autoFocus
            className="rounded-[11px] border-[1.5px] px-3.5 py-2.5 text-sm transition-all focus:border-brand focus:ring-3 focus:ring-brand/10"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[13px] font-medium">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={state.email}
            onChange={(e) =>
              setState((prev) => ({ ...prev, email: e.target.value }))
            }
            required
            autoComplete="email"
            className="rounded-[11px] border-[1.5px] px-3.5 py-2.5 text-sm transition-all focus:border-brand focus:ring-3 focus:ring-brand/10"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-[13px] font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            value={state.password}
            onChange={(e) =>
              setState((prev) => ({ ...prev, password: e.target.value }))
            }
            required
            autoComplete="new-password"
            minLength={8}
            className="rounded-[11px] border-[1.5px] px-3.5 py-2.5 text-sm transition-all focus:border-brand focus:ring-3 focus:ring-brand/10"
          />
          <PasswordStrengthBar password={state.password} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-[13px] font-medium">
            Confirm password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={state.confirmPassword}
            onChange={(e) =>
              setState((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            required
            autoComplete="new-password"
            className="rounded-[11px] border-[1.5px] px-3.5 py-2.5 text-sm transition-all focus:border-brand focus:ring-3 focus:ring-brand/10"
          />
        </div>

        <Button
          type="submit"
          className="mt-2 w-full rounded-xl bg-brand py-3 text-[15px] font-semibold hover:bg-brand-hover"
          disabled={state.isLoading || !isFormValid}
        >
          {state.isLoading ? "Creating account…" : "Create free account"}
          {!state.isLoading && <ArrowRight className="ml-2 size-4" />}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        or
        <div className="h-px flex-1 bg-border" />
      </div>

      <GoogleSignInButton
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
      />

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

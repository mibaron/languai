"use client";

import { ArrowRight, AlertCircle } from "lucide-react";
import { useCallback, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authLoginCreate } from "@/lib/api/orval/api/generated/auth/auth";
import { getAuthErrorMessage } from "@/lib/utils/auth/error-utils";
import { setUserToken } from "@/lib/utils/auth/cookie-utils";

import { GoogleSignInButton } from "./google-sign-in-button";
import type { LoginFormProps, LoginFormState } from "./types";

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [state, setState] = useState<LoginFormState>({
    username: "",
    password: "",
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
    setState((prev) => ({ ...prev, error: null, isLoading: true }));

    try {
      const response = await authLoginCreate({
        username: state.username,
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-[28px] font-[800] tracking-[-0.03em]">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to continue learning.
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
            placeholder="Enter your username"
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
          <Label htmlFor="password" className="text-[13px] font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={state.password}
            onChange={(e) =>
              setState((prev) => ({ ...prev, password: e.target.value }))
            }
            required
            autoComplete="current-password"
            className="rounded-[11px] border-[1.5px] px-3.5 py-2.5 text-sm transition-all focus:border-brand focus:ring-3 focus:ring-brand/10"
          />
        </div>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs text-muted-foreground hover:text-brand"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="mt-2 w-full rounded-xl bg-brand py-3 text-[15px] font-semibold hover:bg-brand-hover"
          disabled={state.isLoading || !state.username || !state.password}
        >
          {state.isLoading ? "Signing in…" : "Sign in"}
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
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-brand hover:underline">
          Create one free
        </Link>
      </p>
    </div>
  );
}

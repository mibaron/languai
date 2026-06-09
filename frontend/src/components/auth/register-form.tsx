"use client";

import { useCallback, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authRegisterCreate } from "@/lib/api/orval/api/generated/auth/auth";
import { getAuthErrorMessage } from "@/lib/utils/auth/error-utils";
import { setUserToken } from "@/lib/utils/auth/cookie-utils";

import { GoogleSignInButton } from "./google-sign-in-button";
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
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Start your German learning journey
        </p>
      </CardHeader>

      <Separator />

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          {state.error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </div>
          )}

          <GoogleSignInButton
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />

          <div className="relative flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={state.email}
              onChange={(e) =>
                setState((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password (min. 8 characters)"
              value={state.password}
              onChange={(e) =>
                setState((prev) => ({ ...prev, password: e.target.value }))
              }
              required
              autoComplete="new-password"
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
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
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            disabled={state.isLoading || !isFormValid}
          >
            {state.isLoading ? "Creating account..." : "Create account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getAuthErrorMessage, login } from "@/lib/api/auth";
import { setUserToken } from "@/lib/utils/auth/cookie-utils";

import type { LoginFormProps, LoginFormState } from "./types";

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [state, setState] = useState<LoginFormState>({
    username: "",
    password: "",
    error: null,
    isLoading: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, error: null, isLoading: true }));

    try {
      const response = await login({
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
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Deutsch Spickzettel
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to track your German learning progress
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

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={state.username}
              onChange={(e) => setState((prev) => ({ ...prev, username: e.target.value }))}
              required
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={state.password}
              onChange={(e) => setState((prev) => ({ ...prev, password: e.target.value }))}
              required
              autoComplete="current-password"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            disabled={state.isLoading || !state.username || !state.password}
          >
            {state.isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Create one
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

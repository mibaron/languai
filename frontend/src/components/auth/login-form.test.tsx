import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/orval/api/generated/auth/auth", () => ({
  authLoginCreate: vi.fn(),
}));

vi.mock("@/lib/utils/auth/cookie-utils", () => ({
  setUserToken: vi.fn(),
}));

vi.mock("./google-sign-in-button", () => ({
  GoogleSignInButton: ({ onSuccess, onError }: { onSuccess: (t: string) => void; onError: (e: string) => void }) => (
    <button onClick={() => onSuccess("google-token")} data-testid="google-btn">
      Google Sign In
    </button>
  ),
}));

import { authLoginCreate } from "@/lib/api/orval/api/generated/auth/auth";
import { setUserToken } from "@/lib/utils/auth/cookie-utils";

import { LoginForm } from "./login-form";

const mockedAuthLogin = vi.mocked(authLoginCreate);
const mockedSetToken = vi.mocked(setUserToken);

describe("LoginForm", () => {
  it("renders heading and subtext", () => {
    render(<LoginForm onSuccess={vi.fn()} />);
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.getByText("Sign in to continue learning.")).toBeInTheDocument();
  });

  it("renders username and password fields", () => {
    render(<LoginForm onSuccess={vi.fn()} />);
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("renders sign in button disabled when fields are empty", () => {
    render(<LoginForm onSuccess={vi.fn()} />);
    expect(screen.getByRole("button", { name: /^sign in$/i })).toBeDisabled();
  });

  it("enables submit button when both fields are filled", async () => {
    const user = userEvent.setup();
    render(<LoginForm onSuccess={vi.fn()} />);

    await user.type(screen.getByLabelText("Username"), "testuser");
    await user.type(screen.getByLabelText("Password"), "password123");

    expect(screen.getByRole("button", { name: /^sign in$/i })).toBeEnabled();
  });

  it("calls API and onSuccess on successful submit", async () => {
    const onSuccess = vi.fn();
    mockedAuthLogin.mockResolvedValueOnce({ token: "abc123" } as never);

    const user = userEvent.setup();
    render(<LoginForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText("Username"), "testuser");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => {
      expect(mockedAuthLogin).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      });
      expect(mockedSetToken).toHaveBeenCalledWith("abc123");
      expect(onSuccess).toHaveBeenCalledWith("abc123");
    });
  });

  it("shows error message on failed submit", async () => {
    mockedAuthLogin.mockRejectedValueOnce({
      response: { data: {}, status: 401 },
    });

    const user = userEvent.setup();
    render(<LoginForm onSuccess={vi.fn()} />);

    await user.type(screen.getByLabelText("Username"), "testuser");
    await user.type(screen.getByLabelText("Password"), "wrong");
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid username or password")).toBeInTheDocument();
    });
  });

  it("renders link to register page", () => {
    render(<LoginForm onSuccess={vi.fn()} />);
    const link = screen.getByRole("link", { name: /create one free/i });
    expect(link).toHaveAttribute("href", "/register");
  });

  it("renders Google sign-in button", () => {
    render(<LoginForm onSuccess={vi.fn()} />);
    expect(screen.getByTestId("google-btn")).toBeInTheDocument();
  });
});

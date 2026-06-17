import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/orval/api/generated/auth/auth", () => ({
  authRegisterCreate: vi.fn(),
}));

vi.mock("@/lib/utils/auth/cookie-utils", () => ({
  setUserToken: vi.fn(),
}));

vi.mock("./google-sign-in-button", () => ({
  GoogleSignInButton: ({ onSuccess }: { onSuccess: (t: string) => void }) => (
    <button onClick={() => onSuccess("google-token")} data-testid="google-btn">
      Google Sign In
    </button>
  ),
}));

import { authRegisterCreate } from "@/lib/api/orval/api/generated/auth/auth";
import { setUserToken } from "@/lib/utils/auth/cookie-utils";

import { RegisterForm } from "./register-form";

const mockedAuthRegister = vi.mocked(authRegisterCreate);
const mockedSetToken = vi.mocked(setUserToken);

describe("RegisterForm", () => {
  it("renders heading and subtitle", () => {
    render(<RegisterForm onSuccess={vi.fn()} />);
    expect(screen.getByText("Create your account")).toBeInTheDocument();
    expect(screen.getByText("Free forever. No credit card required.")).toBeInTheDocument();
  });

  it("renders all form fields", () => {
    render(<RegisterForm onSuccess={vi.fn()} />);
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
  });

  it("renders back to sign in link", () => {
    render(<RegisterForm onSuccess={vi.fn()} />);
    const link = screen.getByRole("link", { name: /back to sign in/i });
    expect(link).toHaveAttribute("href", "/login");
  });

  it("shows password mismatch error", async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSuccess={vi.fn()} />);

    await user.type(screen.getByLabelText("Username"), "testuser");
    await user.type(screen.getByLabelText("Email address"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText("Confirm password"), "different456");
    await user.click(screen.getByRole("button", { name: /create free account/i }));

    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
  });

  it("calls API and onSuccess on successful submit", async () => {
    const onSuccess = vi.fn();
    mockedAuthRegister.mockResolvedValueOnce({ token: "new-token" } as never);

    const user = userEvent.setup();
    render(<RegisterForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText("Username"), "newuser");
    await user.type(screen.getByLabelText("Email address"), "new@example.com");
    await user.type(screen.getByLabelText("Password"), "StrongPass1!");
    await user.type(screen.getByLabelText("Confirm password"), "StrongPass1!");
    await user.click(screen.getByRole("button", { name: /create free account/i }));

    await waitFor(() => {
      expect(mockedAuthRegister).toHaveBeenCalledWith({
        username: "newuser",
        email: "new@example.com",
        password: "StrongPass1!",
      });
      expect(mockedSetToken).toHaveBeenCalledWith("new-token");
      expect(onSuccess).toHaveBeenCalledWith("new-token");
    });
  });

  it("shows API error on failed submit", async () => {
    mockedAuthRegister.mockRejectedValueOnce({
      response: { data: { username: ["This username is taken."] } },
    });

    const user = userEvent.setup();
    render(<RegisterForm onSuccess={vi.fn()} />);

    await user.type(screen.getByLabelText("Username"), "taken");
    await user.type(screen.getByLabelText("Email address"), "t@e.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText("Confirm password"), "password123");
    await user.click(screen.getByRole("button", { name: /create free account/i }));

    await waitFor(() => {
      expect(screen.getByText("Username: This username is taken.")).toBeInTheDocument();
    });
  });

  it("shows password strength bar when password is typed", async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSuccess={vi.fn()} />);

    await user.type(screen.getByLabelText("Password"), "abcdefgh");
    expect(screen.getByText("Weak")).toBeInTheDocument();
  });

  it("renders sign in link at bottom", () => {
    render(<RegisterForm onSuccess={vi.fn()} />);
    const link = screen.getByRole("link", { name: /^sign in$/i });
    expect(link).toHaveAttribute("href", "/login");
  });

  it("submit button disabled when fields empty", () => {
    render(<RegisterForm onSuccess={vi.fn()} />);
    expect(screen.getByRole("button", { name: /create free account/i })).toBeDisabled();
  });
});

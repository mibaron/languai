import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("AuthLayout", () => {
  it("renders children", async () => {
    const { AuthLayout } = await import("./auth-layout");
    render(
      <AuthLayout>
        <div>Login form here</div>
      </AuthLayout>,
    );
    expect(screen.getByText("Login form here")).toBeInTheDocument();
  });

  it("renders brand panel headline", async () => {
    const { AuthLayout } = await import("./auth-layout");
    render(
      <AuthLayout>
        <div>Form</div>
      </AuthLayout>,
    );
    expect(screen.getByText("Learn German.")).toBeInTheDocument();
    expect(screen.getByText("Your way.")).toBeInTheDocument();
  });

  it("renders Langu-AI logo text", async () => {
    const { AuthLayout } = await import("./auth-layout");
    render(
      <AuthLayout>
        <div>Form</div>
      </AuthLayout>,
    );
    const logos = screen.getAllByText("Langu-AI");
    expect(logos.length).toBeGreaterThanOrEqual(1);
  });

  it("renders all 4 perks", async () => {
    const { AuthLayout } = await import("./auth-layout");
    render(
      <AuthLayout>
        <div>Form</div>
      </AuthLayout>,
    );
    expect(screen.getByText(/AI-personalized/)).toBeInTheDocument();
    expect(screen.getByText(/Gamified/)).toBeInTheDocument();
    expect(screen.getByText(/Official exam prep/)).toBeInTheDocument();
    expect(screen.getAllByText(/Free forever/).length).toBeGreaterThanOrEqual(1);
  });

  it("renders copyright", async () => {
    const { AuthLayout } = await import("./auth-layout");
    render(
      <AuthLayout>
        <div>Form</div>
      </AuthLayout>,
    );
    expect(screen.getByText("© 2026 Langu-AI")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Eyebrow, Heading, Muted } from "./typography";

describe("Heading", () => {
  it("renders as h2 by default", () => {
    render(<Heading>Test Heading</Heading>);
    const el = screen.getByText("Test Heading");
    expect(el.tagName).toBe("H2");
  });

  it("renders as h1 when specified", () => {
    render(<Heading as="h1">Hero Title</Heading>);
    const el = screen.getByText("Hero Title");
    expect(el.tagName).toBe("H1");
  });

  it("renders as h3 when specified", () => {
    render(<Heading as="h3">Subsection</Heading>);
    const el = screen.getByText("Subsection");
    expect(el.tagName).toBe("H3");
  });

  it("applies custom className", () => {
    render(<Heading className="text-red-500">Styled</Heading>);
    expect(screen.getByText("Styled")).toHaveClass("text-red-500");
  });
});

describe("Eyebrow", () => {
  it("renders children", () => {
    render(<Eyebrow>New Feature</Eyebrow>);
    expect(screen.getByText("New Feature")).toBeInTheDocument();
  });

  it("renders as a span", () => {
    render(<Eyebrow>Label</Eyebrow>);
    expect(screen.getByText("Label").tagName).toBe("SPAN");
  });

  it("applies custom className", () => {
    render(<Eyebrow className="mt-4">Spaced</Eyebrow>);
    expect(screen.getByText("Spaced")).toHaveClass("mt-4");
  });
});

describe("Muted", () => {
  it("renders children in a paragraph", () => {
    render(<Muted>Some muted text</Muted>);
    const el = screen.getByText("Some muted text");
    expect(el.tagName).toBe("P");
  });

  it("applies base size by default", () => {
    render(<Muted>Default size</Muted>);
    expect(screen.getByText("Default size")).toHaveClass("text-base");
  });

  it("applies sm size", () => {
    render(<Muted size="sm">Small</Muted>);
    expect(screen.getByText("Small")).toHaveClass("text-sm");
  });

  it("applies lg size", () => {
    render(<Muted size="lg">Large</Muted>);
    expect(screen.getByText("Large")).toHaveClass("text-lg");
  });

  it("has muted-foreground class", () => {
    render(<Muted>Muted text</Muted>);
    expect(screen.getByText("Muted text")).toHaveClass("text-muted-foreground");
  });
});

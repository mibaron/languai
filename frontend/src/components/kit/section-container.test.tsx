import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SectionContainer } from "./section-container";

describe("SectionContainer", () => {
  it("renders children", () => {
    render(<SectionContainer>Content here</SectionContainer>);
    expect(screen.getByText("Content here")).toBeInTheDocument();
  });

  it("renders as a section element", () => {
    const { container } = render(
      <SectionContainer>Inner</SectionContainer>,
    );
    expect(container.querySelector("section")).toBeInTheDocument();
  });

  it("applies id for anchor links", () => {
    const { container } = render(
      <SectionContainer id="features">Features</SectionContainer>,
    );
    expect(container.querySelector("#features")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <SectionContainer className="bg-red-500">Styled</SectionContainer>,
    );
    expect(container.querySelector("section")).toHaveClass("bg-red-500");
  });

  it("wraps children in max-w-7xl container", () => {
    const { container } = render(
      <SectionContainer>Wrapped</SectionContainer>,
    );
    const innerDiv = container.querySelector(".max-w-7xl");
    expect(innerDiv).toBeInTheDocument();
    expect(innerDiv).toHaveTextContent("Wrapped");
  });
});

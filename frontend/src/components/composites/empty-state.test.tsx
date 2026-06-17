import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("renders icon, title, and description", () => {
    render(
      <EmptyState
        icon={<span data-testid="test-icon">icon</span>}
        title="No Items"
        description="Nothing to see here."
      />,
    );
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    expect(screen.getByText("No Items")).toBeInTheDocument();
    expect(screen.getByText("Nothing to see here.")).toBeInTheDocument();
  });

  it("renders badge when provided", () => {
    render(
      <EmptyState
        icon={<span>icon</span>}
        title="Title"
        description="Desc"
        badge="Coming soon"
      />,
    );
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
  });

  it("does not render badge when not provided", () => {
    render(
      <EmptyState
        icon={<span>icon</span>}
        title="Title"
        description="Desc"
      />,
    );
    expect(screen.queryByText("Coming soon")).not.toBeInTheDocument();
  });
});

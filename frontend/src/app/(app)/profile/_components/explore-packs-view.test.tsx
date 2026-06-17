import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/orval/api/generated/packs/packs", () => ({
  usePacksList: () => ({
    data: {
      results: [
        {
          id: "p1",
          title: "German A1.1",
          slug: "a1-1-en",
          level_code: "A1.1",
          base_language: "English",
          description: "Beginner German",
          grammar_count: 10,
          vocab_count: 20,
          exercise_count: 5,
          subscriber_count: 1,
        },
        {
          id: "p2",
          title: "German A1.2",
          slug: "a1-2-en",
          level_code: "A1.2",
          base_language: "English",
          description: "Continue A1",
          grammar_count: 8,
          vocab_count: 15,
          exercise_count: 3,
          subscriber_count: 0,
        },
      ],
    },
  }),
}));

import { ExplorePacksView } from "./explore-packs-view";

describe("ExplorePacksView", () => {
  it("renders browse header and search", () => {
    render(
      <ExplorePacksView
        open={true}
        subscribedPackIds={[]}
        onSubscribe={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText("Browse Packs")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search packs..."),
    ).toBeInTheDocument();
  });

  it("renders featured and all packs sections", () => {
    render(
      <ExplorePacksView
        open={true}
        subscribedPackIds={[]}
        onSubscribe={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText("Featured")).toBeInTheDocument();
    expect(screen.getByText("All Packs")).toBeInTheDocument();
  });

  it("shows subscribed state for subscribed packs", () => {
    render(
      <ExplorePacksView
        open={true}
        subscribedPackIds={["p1"]}
        onSubscribe={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getAllByText("Subscribed").length).toBeGreaterThan(0);
  });

  it("filters packs by search query", async () => {
    const user = userEvent.setup();
    render(
      <ExplorePacksView
        open={true}
        subscribedPackIds={[]}
        onSubscribe={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    await user.type(
      screen.getByPlaceholderText("Search packs..."),
      "A1.2",
    );
    expect(screen.queryByText("Featured")).not.toBeInTheDocument();
    expect(screen.queryByText("All Packs")).not.toBeInTheDocument();
  });

  it("calls onSubscribe when Add Pack is clicked", async () => {
    const user = userEvent.setup();
    const onSubscribe = vi.fn();
    render(
      <ExplorePacksView
        open={true}
        subscribedPackIds={[]}
        onSubscribe={onSubscribe}
        onClose={vi.fn()}
      />,
    );
    const addButtons = screen.getAllByText("Add Pack");
    await user.click(addButtons[0]);
    expect(onSubscribe).toHaveBeenCalled();
  });

  it("calls onClose when back button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = render(
      <ExplorePacksView
        open={true}
        subscribedPackIds={[]}
        onSubscribe={vi.fn()}
        onClose={onClose}
      />,
    );
    const backButton = container.querySelector("button");
    await user.click(backButton!);
    expect(onClose).toHaveBeenCalled();
  });
});

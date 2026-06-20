import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TableRenderer } from "./table-renderer";

const makeDetail = (overrides = {}) => ({
  headers: ["Deutsch", "English"],
  rows: [
    ["Hallo", "Hello"],
    ["Tschüss", "Bye"],
  ],
  note: "",
  part_type: "table" as const,
  ...overrides,
});

describe("TableRenderer", () => {
  it("renders table headers", () => {
    render(<TableRenderer detail={makeDetail()} />);
    expect(screen.getByText("Deutsch")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("renders table rows", () => {
    render(<TableRenderer detail={makeDetail()} />);
    expect(screen.getByText("Hallo")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Tschüss")).toBeInTheDocument();
    expect(screen.getByText("Bye")).toBeInTheDocument();
  });

  it("renders note when present", () => {
    render(<TableRenderer detail={makeDetail({ note: "Subject pronouns" })} />);
    expect(screen.getByText("Subject pronouns")).toBeInTheDocument();
  });

  it("does not render note when empty", () => {
    render(<TableRenderer detail={makeDetail()} />);
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(3);
  });

  it("handles empty headers", () => {
    render(<TableRenderer detail={makeDetail({ headers: [] })} />);
    expect(screen.queryByRole("columnheader")).toBeNull();
    expect(screen.getByText("Hallo")).toBeInTheDocument();
  });

  it("renders multiple columns", () => {
    const detail = makeDetail({
      headers: ["Verb", "ich", "du", "er/sie/es"],
      rows: [["sein", "bin", "bist", "ist"]],
    });
    render(<TableRenderer detail={detail} />);
    expect(screen.getByText("Verb")).toBeInTheDocument();
    expect(screen.getByText("bin")).toBeInTheDocument();
    expect(screen.getByText("ist")).toBeInTheDocument();
  });
});

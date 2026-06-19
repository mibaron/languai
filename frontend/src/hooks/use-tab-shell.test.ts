import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

let mockPathname = "/learn";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

import { useTabShell } from "./use-tab-shell";

describe("useTabShell", () => {
  beforeEach(() => {
    mockPathname = "/learn";
    vi.spyOn(window.history, "replaceState").mockImplementation(() => {});
  });

  it("derives initial tab from pathname", () => {
    mockPathname = "/practice";
    const { result } = renderHook(() => useTabShell());
    expect(result.current.activeTab).toBe("practice");
  });

  it("defaults to learn for unknown paths", () => {
    mockPathname = "/unknown";
    const { result } = renderHook(() => useTabShell());
    expect(result.current.activeTab).toBe("learn");
  });

  it("identifies tab routes as not sub-routes", () => {
    mockPathname = "/learn";
    const { result } = renderHook(() => useTabShell());
    expect(result.current.isSubRoute).toBe(false);
  });

  it("identifies sub-routes correctly", () => {
    mockPathname = "/practice/session";
    const { result } = renderHook(() => useTabShell());
    expect(result.current.isSubRoute).toBe(true);
  });

  it("switchTab updates activeTab and calls replaceState", () => {
    const { result } = renderHook(() => useTabShell());
    act(() => {
      result.current.switchTab("profile");
    });
    expect(result.current.activeTab).toBe("profile");
    expect(window.history.replaceState).toHaveBeenCalledWith(
      null,
      "",
      "/profile",
    );
  });

  it("derives parent tab for sub-routes", () => {
    mockPathname = "/practice/session";
    const { result } = renderHook(() => useTabShell());
    expect(result.current.activeTab).toBe("practice");
  });
});

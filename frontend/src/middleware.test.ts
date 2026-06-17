import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

import { middleware } from "./middleware";

vi.mock("@/lib/utils/auth/middleware-cookie", () => ({
  getUserTokenFromRequest: vi.fn(),
}));

import { getUserTokenFromRequest } from "@/lib/utils/auth/middleware-cookie";

const mockedGetToken = vi.mocked(getUserTokenFromRequest);

function createRequest(path: string) {
  return new NextRequest(new URL(path, "http://localhost:3000"));
}

describe("middleware", () => {
  describe("unauthenticated user", () => {
    beforeEach(() => {
      mockedGetToken.mockReturnValue(undefined);
    });

    it("allows access to /", () => {
      const response = middleware(createRequest("/"));
      expect(response.headers.get("x-middleware-rewrite")).toBeNull();
      expect(response.headers.get("location")).toBeNull();
    });

    it("allows access to /login", () => {
      const response = middleware(createRequest("/login"));
      expect(response.headers.get("location")).toBeNull();
    });

    it("allows access to /register", () => {
      const response = middleware(createRequest("/register"));
      expect(response.headers.get("location")).toBeNull();
    });

    it("redirects /learn to /login with next param", () => {
      const response = middleware(createRequest("/learn"));
      const location = response.headers.get("location");
      expect(location).toContain("/login");
      expect(location).toContain("next=%2Flearn");
    });

    it("redirects /profile to /login with next param", () => {
      const response = middleware(createRequest("/profile"));
      const location = response.headers.get("location");
      expect(location).toContain("/login");
      expect(location).toContain("next=%2Fprofile");
    });

    it("redirects nested protected path", () => {
      const response = middleware(createRequest("/learn/grammar"));
      const location = response.headers.get("location");
      expect(location).toContain("/login");
      expect(location).toContain("next=%2Flearn%2Fgrammar");
    });
  });

  describe("authenticated user", () => {
    beforeEach(() => {
      mockedGetToken.mockReturnValue("valid-token-123");
    });

    it("allows access to /", () => {
      const response = middleware(createRequest("/"));
      expect(response.headers.get("location")).toBeNull();
    });

    it("redirects /login to /learn", () => {
      const response = middleware(createRequest("/login"));
      const location = response.headers.get("location");
      expect(location).toContain("/learn");
    });

    it("redirects /register to /learn", () => {
      const response = middleware(createRequest("/register"));
      const location = response.headers.get("location");
      expect(location).toContain("/learn");
    });

    it("allows access to /learn (no redirect loop)", () => {
      const response = middleware(createRequest("/learn"));
      expect(response.headers.get("location")).toBeNull();
    });

    it("allows access to /profile", () => {
      const response = middleware(createRequest("/profile"));
      expect(response.headers.get("location")).toBeNull();
    });

    it("does not redirect / to /learn (landing page stays accessible)", () => {
      const response = middleware(createRequest("/"));
      expect(response.headers.get("location")).toBeNull();
    });
  });
});

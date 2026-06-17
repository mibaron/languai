import { describe, expect, it } from "vitest";

import { getAuthErrorMessage } from "./error-utils";

describe("getAuthErrorMessage", () => {
  it("returns error.message when present", () => {
    const error = {
      response: { data: { error: { code: "E001", message: "Account locked" } } },
    };
    expect(getAuthErrorMessage(error)).toBe("Account locked");
  });

  it("returns non_field_errors first entry", () => {
    const error = {
      response: { data: { non_field_errors: ["Invalid credentials"] } },
    };
    expect(getAuthErrorMessage(error)).toBe("Invalid credentials");
  });

  it("returns username error with prefix", () => {
    const error = {
      response: { data: { username: ["This field is required."] } },
    };
    expect(getAuthErrorMessage(error)).toBe("Username: This field is required.");
  });

  it("returns email error with prefix", () => {
    const error = {
      response: { data: { email: ["Enter a valid email address."] } },
    };
    expect(getAuthErrorMessage(error)).toBe("Email: Enter a valid email address.");
  });

  it("returns password error with prefix", () => {
    const error = {
      response: { data: { password: ["Too short."] } },
    };
    expect(getAuthErrorMessage(error)).toBe("Password: Too short.");
  });

  it("returns 401 message for unauthorized status", () => {
    const error = { response: { data: {}, status: 401 } };
    expect(getAuthErrorMessage(error)).toBe("Invalid username or password");
  });

  it("returns generic message for unknown errors", () => {
    expect(getAuthErrorMessage(new Error("network"))).toBe(
      "Something went wrong. Please try again.",
    );
  });

  it("returns generic message for null", () => {
    expect(getAuthErrorMessage(null)).toBe(
      "Something went wrong. Please try again.",
    );
  });

  it("returns generic message for string", () => {
    expect(getAuthErrorMessage("boom")).toBe(
      "Something went wrong. Please try again.",
    );
  });

  it("prioritizes error.message over field errors", () => {
    const error = {
      response: {
        data: {
          error: { code: "E001", message: "Primary error" },
          username: ["Also bad"],
        },
      },
    };
    expect(getAuthErrorMessage(error)).toBe("Primary error");
  });
});

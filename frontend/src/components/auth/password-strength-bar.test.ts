import { describe, expect, it } from "vitest";

import { getPasswordStrength } from "./password-strength-bar";

describe("getPasswordStrength", () => {
  it("returns empty result for empty password", () => {
    const result = getPasswordStrength("");
    expect(result).toEqual({ score: 0, label: "", color: "" });
  });

  it("returns Weak for short password with no complexity", () => {
    const result = getPasswordStrength("abcdefgh");
    expect(result.score).toBe(1);
    expect(result.label).toBe("Weak");
    expect(result.color).toBe("bg-red-500");
  });

  it("returns Fair for 12+ char password without other criteria", () => {
    const result = getPasswordStrength("abcdefghijkl");
    expect(result.score).toBe(2);
    expect(result.label).toBe("Fair");
  });

  it("returns Good for 8+ chars with uppercase and digit", () => {
    const result = getPasswordStrength("Abcdefg1");
    expect(result.score).toBe(2);
    expect(result.label).toBe("Fair");
  });

  it("returns Good for 12+ chars with uppercase and digit", () => {
    const result = getPasswordStrength("Abcdefghijk1");
    expect(result.score).toBe(3);
    expect(result.label).toBe("Good");
  });

  it("returns Strong for 12+ chars with uppercase, digit, and special char", () => {
    const result = getPasswordStrength("Abcdefghij1!");
    expect(result.score).toBe(4);
    expect(result.label).toBe("Strong");
    expect(result.color).toBe("bg-green-500");
  });

  it("scores special char without uppercase+digit as Fair", () => {
    const result = getPasswordStrength("abcdefg!");
    expect(result.score).toBe(2);
    expect(result.label).toBe("Fair");
  });

  it("requires both uppercase AND digit for the complexity point", () => {
    const result = getPasswordStrength("Abcdefgh");
    expect(result.score).toBe(1);
    expect(result.label).toBe("Weak");
  });

  it("returns Weak for 7-char password (no criteria met)", () => {
    const result = getPasswordStrength("abcdefg");
    expect(result.score).toBe(1);
    expect(result.label).toBe("Weak");
  });
});

import { describe, it, expect, beforeEach, vi } from "vitest";

import {
  clearOnboardingStorage,
  getStoredOnboardingData,
} from "./use-onboarding";

const STORAGE_KEY = "langu-ai-onboarding";

describe("onboarding localStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null when no data stored", () => {
    expect(getStoredOnboardingData()).toBeNull();
  });

  it("returns stored data when present", () => {
    const data = {
      nativeLanguage: "en",
      selectedPackIds: ["id-1", "id-2"],
      selectedGoalId: "goal-1",
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    const result = getStoredOnboardingData();
    expect(result).toEqual(data);
  });

  it("returns stored data with null goal", () => {
    const data = {
      nativeLanguage: "en",
      selectedPackIds: [],
      selectedGoalId: null,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    const result = getStoredOnboardingData();
    expect(result?.selectedGoalId).toBeNull();
  });

  it("returns null for invalid JSON", () => {
    localStorage.setItem(STORAGE_KEY, "not-json");
    expect(getStoredOnboardingData()).toBeNull();
  });

  it("clears stored data", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ nativeLanguage: "en", selectedPackIds: [] }));
    clearOnboardingStorage();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});

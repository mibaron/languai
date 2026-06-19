"use client";

import { useCallback, useState } from "react";

import { useGoalsList } from "@/lib/api/orval/api/generated/goals/goals";
import { usePacksList } from "@/lib/api/orval/api/generated/packs/packs";

import type { OnboardingData } from "../_components/types";

const STORAGE_KEY = "langu-ai-onboarding";
const TOTAL_STEPS = 4;

function loadFromStorage(): OnboardingData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OnboardingData;
  } catch {
    return null;
  }
}

function saveToStorage(data: OnboardingData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearOnboardingStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getStoredOnboardingData(): OnboardingData | null {
  return loadFromStorage();
}

export function useOnboarding() {
  const stored = loadFromStorage();

  const [step, setStep] = useState(1);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    stored?.nativeLanguage ? [stored.nativeLanguage] : ["en"],
  );
  const [primaryLanguage, setPrimaryLanguage] = useState(
    stored?.nativeLanguage ?? "en",
  );
  const [selectedPackIds, setSelectedPackIds] = useState<string[]>(
    stored?.selectedPackIds ?? [],
  );
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(
    stored?.selectedGoalId ?? null,
  );

  const { data: packsResponse, isLoading: packsLoading } = usePacksList();
  const packs = packsResponse?.results ?? [];

  const { data: goalsData, isLoading: goalsLoading } = useGoalsList();
  const goals = goalsData ?? [];

  const toggleLanguage = useCallback(
    (langCode: string) => {
      if (selectedLanguages.includes(langCode)) {
        if (selectedLanguages.length === 1) return;
        const next = selectedLanguages.filter((l) => l !== langCode);
        setSelectedLanguages(next);
        if (primaryLanguage === langCode) setPrimaryLanguage(next[0]);
      } else {
        if (selectedLanguages.length >= 3) return;
        setSelectedLanguages((prev) => [...prev, langCode]);
      }
    },
    [selectedLanguages, primaryLanguage],
  );

  const togglePack = useCallback((packId: string) => {
    setSelectedPackIds((prev) =>
      prev.includes(packId)
        ? prev.filter((id) => id !== packId)
        : [...prev, packId],
    );
  }, []);

  const selectGoal = useCallback((goalId: string) => {
    setSelectedGoalId(goalId);
  }, []);

  const canContinue = step === 4 ? selectedPackIds.length > 0 : true;

  const persistToStorage = useCallback(() => {
    saveToStorage({
      nativeLanguage: primaryLanguage,
      selectedPackIds,
      selectedGoalId,
    });
  }, [primaryLanguage, selectedPackIds, selectedGoalId]);

  const goNext = useCallback(() => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    }
  }, [step]);

  const goBack = useCallback(() => {
    if (step > 1) {
      setStep((s) => s - 1);
    }
  }, [step]);

  return {
    step,
    totalSteps: TOTAL_STEPS,
    selectedLanguages,
    primaryLanguage,
    selectedPackIds,
    selectedGoalId,
    goals,
    goalsLoading,
    packs,
    packsLoading,
    canContinue,
    toggleLanguage,
    togglePack,
    selectGoal,
    goNext,
    goBack,
    persistToStorage,
  };
}

"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { onboardingCreate, onboardingRetrieve } from "@/lib/api/orval/api/generated/onboarding/onboarding";
import {
  getStoredOnboardingData,
  clearOnboardingStorage,
} from "@/app/(auth)/onboarding/_hooks/use-onboarding";

export function useOnboardingSync() {
  const router = useRouter();

  const syncAndRedirect = useCallback(
    async (fallbackPath: string) => {
      try {
        const status = await onboardingRetrieve();

        if (status.is_onboarded) {
          router.push(fallbackPath);
          return;
        }

        const stored = getStoredOnboardingData();
        if (stored && stored.selectedPackIds.length > 0) {
          await onboardingCreate({
            native_language: stored.nativeLanguage,
            pack_ids: stored.selectedPackIds,
          });
          clearOnboardingStorage();
          router.push(fallbackPath);
          return;
        }

        router.push("/onboarding");
      } catch {
        router.push(fallbackPath);
      }
    },
    [router],
  );

  return { syncAndRedirect };
}

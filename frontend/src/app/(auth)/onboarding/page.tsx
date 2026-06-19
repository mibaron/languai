"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { onboardingCreate } from "@/lib/api/orval/api/generated/onboarding/onboarding";
import { getUserToken } from "@/lib/utils/auth/cookie-utils";
import { ChevronRight } from "lucide-react";

import { ProgressHeader } from "./_components/progress-header";
import { StepGoals } from "./_components/step-goals";
import { StepLanguage } from "./_components/step-language";
import { StepPacks } from "./_components/step-packs";
import { StepTarget } from "./_components/step-target";
import { useOnboarding } from "./_hooks/use-onboarding";
import { clearOnboardingStorage } from "./_hooks/use-onboarding";

export default function OnboardingPage() {
  const router = useRouter();
  const {
    step,
    totalSteps,
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
  } = useOnboarding();

  const handleContinue = useCallback(async () => {
    if (step < totalSteps) {
      goNext();
      return;
    }

    persistToStorage();

    const token = getUserToken();
    if (token) {
      try {
        await onboardingCreate({
          native_language: primaryLanguage,
          pack_ids: selectedPackIds,
          learning_goal: selectedGoalId,
        });
        clearOnboardingStorage();
        router.push("/learn");
      } catch {
        router.push("/learn");
      }
    } else {
      router.push("/register");
    }
  }, [
    step,
    totalSteps,
    goNext,
    persistToStorage,
    primaryLanguage,
    selectedPackIds,
    selectedGoalId,
    router,
  ]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex h-full w-full max-w-md flex-col">
        <div className="h-[60px] shrink-0" />
        <ProgressHeader
          currentStep={step}
          totalSteps={totalSteps}
          onBack={goBack}
        />

        <div className="relative min-h-0 flex-1 overflow-hidden">
          <div
            className="flex h-full transition-transform duration-[380ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
            style={{
              width: `${totalSteps * 100}%`,
              transform: `translateX(${-(step - 1) * (100 / totalSteps)}%)`,
            }}
          >
            <div
              className="shrink-0 overflow-y-auto"
              style={{ width: `${100 / totalSteps}%` }}
            >
              <StepLanguage
                selectedLanguages={selectedLanguages}
                primaryLanguage={primaryLanguage}
                onToggle={toggleLanguage}
              />
            </div>
            <div
              className="shrink-0 overflow-y-auto"
              style={{ width: `${100 / totalSteps}%` }}
            >
              <StepTarget />
            </div>
            <div
              className="shrink-0 overflow-y-auto"
              style={{ width: `${100 / totalSteps}%` }}
            >
              <StepGoals
                goals={goals}
                selectedGoalId={selectedGoalId}
                onSelect={selectGoal}
                isLoading={goalsLoading}
              />
            </div>
            <div
              className="shrink-0 overflow-y-auto"
              style={{ width: `${100 / totalSteps}%` }}
            >
              <StepPacks
                packs={packs}
                selectedPackIds={selectedPackIds}
                onToggle={togglePack}
                isLoading={packsLoading}
              />
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-border px-5 pb-11 pt-3">
          <Button
            className="w-full rounded-xl bg-brand py-3 text-[15px] font-semibold hover:bg-brand-hover"
            disabled={!canContinue}
            onClick={handleContinue}
          >
            {step === totalSteps ? "Start Learning" : "Continue"}
            {step < totalSteps && <ChevronRight className="ml-2 size-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

import type { Pack } from "@/lib/api/orval/api/generated/model";

export interface OnboardingData {
  nativeLanguage: string;
  selectedPackIds: string[];
}

export interface StepLanguageProps {
  selectedLanguages: string[];
  primaryLanguage: string;
  onToggle: (lang: string) => void;
}

export interface StepTargetProps {}

export interface StepPacksProps {
  packs: Pack[];
  selectedPackIds: string[];
  onToggle: (packId: string) => void;
  isLoading: boolean;
}

export interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
}

import type { LearningGoal, Pack } from "@/lib/api/orval/api/generated/model";

export interface OnboardingData {
  nativeLanguage: string;
  selectedPackIds: string[];
  selectedGoalId: string | null;
}

export interface StepLanguageProps {
  selectedLanguages: string[];
  primaryLanguage: string;
  onToggle: (lang: string) => void;
}

export interface StepTargetProps {}

export interface StepGoalsProps {
  goals: LearningGoal[];
  selectedGoalId: string | null;
  onSelect: (goalId: string) => void;
  isLoading: boolean;
}

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

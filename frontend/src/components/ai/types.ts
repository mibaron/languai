import type {
  AIActionType,
  AIContentResponse,
  AIExamplesResponse,
  AIExplanationResponse,
  AIItemContext,
  AIQuizResponse,
  LLMModelOption,
} from "@/types/ai-content";

export interface AIButtonProps {
  context: AIItemContext;
}

export interface AIContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context: AIItemContext;
}

export interface AIExamplesViewProps {
  data: AIExamplesResponse;
}

export interface AIQuizViewProps {
  data: AIQuizResponse;
}

export interface AIExplanationViewProps {
  data: AIExplanationResponse;
}

export interface AIResponseViewProps {
  content: AIContentResponse;
  onSave: () => void;
  isSaved: boolean;
}

export interface AIContentCardProps {
  content: AIContentResponse;
  onSave: (id: string) => Promise<void>;
  onDelete: (id: string) => void;
  onRegenerate: (content: AIContentResponse) => void;
  isDeleting: boolean;
}

export interface ModelSelectProps {
  models: LLMModelOption[];
  value: string;
  onChange: (value: string) => void;
  promptsRemaining: number | null;
}

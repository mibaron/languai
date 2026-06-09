import type { AIContent, LLMModel } from "@/lib/api/orval/api/generated/model";
import type {
  AIExamplesResponse,
  AIExplanationResponse,
  AIItemContext,
  AIQuizResponse,
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
  content: AIContent;
  onSave: () => void;
  isSaved: boolean;
}

export interface AIContentCardProps {
  content: AIContent;
  onSave: (id: string) => Promise<void>;
  onDelete: (id: string) => void;
  onRegenerate: (content: AIContent) => void;
  isDeleting: boolean;
}

export interface ModelSelectProps {
  models: LLMModel[];
  value: string;
  onChange: (value: string) => void;
  promptsRemaining: number | null;
}

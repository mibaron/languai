import type { AIContent } from "@/lib/api/orval/api/generated/model";
import type { AIItemContext } from "@/types/ai-content";

export interface ExplainModeContextValue {
  explainMode: boolean;
  hasExplainableContent: boolean;
  setHasExplainableContent: (value: boolean) => void;
  enterExplainMode: () => void;
  exitExplainMode: () => void;
  explainItem: AIItemContext | null;
  explainContent: AIContent[] | null;
  isExplaining: boolean;
  error: string | null;
  triggerExplain: (context: AIItemContext) => void;
}

"use client";

import { useCallback, useState } from "react";

import {
  aiGenerateCreate,
  aiModelsList,
} from "@/lib/api/orval/api/generated/ai-content/ai-content";
import { useAuthMeRetrieve } from "@/lib/api/orval/api/generated/auth/auth";
import type { AIContent, CategoryEnum } from "@/lib/api/orval/api/generated/model";
import type { AIItemContext } from "@/types/ai-content";
import type { ExplainModeContextValue } from "@/types/explain-mode";

export function useExplainMode(
  switchTab: (tab: "learn" | "explain" | "practice" | "profile") => void,
): ExplainModeContextValue {
  const [explainMode, setExplainMode] = useState(false);
  const [hasExplainableContent, setHasExplainableContent] = useState(false);
  const [explainItem, setExplainItem] = useState<AIItemContext | null>(null);
  const [explainContent, setExplainContent] = useState<AIContent[] | null>(
    null,
  );
  const [isExplaining, setIsExplaining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: user } = useAuthMeRetrieve();

  const enterExplainMode = useCallback(() => {
    setExplainMode(true);
  }, []);

  const exitExplainMode = useCallback(() => {
    setExplainMode(false);
  }, []);

  const triggerExplain = useCallback(
    async (context: AIItemContext) => {
      setExplainItem(context);
      setIsExplaining(true);
      setError(null);
      switchTab("explain");

      try {
        let modelId = user?.preferred_model_id || undefined;

        if (!modelId) {
          const models = await aiModelsList();
          const defaultModel = models.find((m) => m.is_default);
          modelId = defaultModel?.model_id;
        }

        const response = await aiGenerateCreate({
          level_code: context.levelCode,
          category: context.category as CategoryEnum,
          section_title: context.sectionTitle,
          section_headers: context.sectionHeaders,
          item_cells: context.itemCells,
          action_type: "explanation",
          model: modelId,
        });

        setExplainContent([response]);
      } catch {
        setError("Failed to generate explanation. Please try again.");
      } finally {
        setIsExplaining(false);
      }
    },
    [switchTab, user?.preferred_model_id],
  );

  return {
    explainMode,
    hasExplainableContent,
    setHasExplainableContent,
    enterExplainMode,
    exitExplainMode,
    explainItem,
    explainContent,
    isExplaining,
    error,
    triggerExplain,
  };
}

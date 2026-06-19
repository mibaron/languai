"use client";

import { Lightbulb, Loader2, Sparkles } from "lucide-react";

import { AIExplanationView } from "@/components/ai/ai-explanation-view";
import { EmptyState } from "@/components/composites/empty-state";
import { Badge } from "@/components/ui/badge";
import { useExplainModeContext } from "@/contexts/explain-mode-context";
import type { AIExplanationResponse } from "@/types/ai-content";

function formatModelName(modelId: string): string {
  const parts = modelId.split("/");
  return parts[parts.length - 1];
}

export function ExplainTabContent() {
  const { explainItem, explainContent, isExplaining, error } =
    useExplainModeContext();

  if (isExplaining && explainItem) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4">
        <Loader2 className="size-6 animate-spin text-brand" />
        <div className="text-center">
          <div className="text-sm font-medium text-foreground">
            Generating explanation...
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {explainItem.itemCells.join(" · ")}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      </div>
    );
  }

  if (explainContent && explainContent.length > 0 && explainItem) {
    const content = explainContent[0];
    let explanationData: AIExplanationResponse | null = null;

    try {
      explanationData = content.response_json as AIExplanationResponse;
    } catch {
      // fall through to raw text
    }

    return (
      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-border/50 px-4 py-3">
          <div className="text-sm font-semibold text-foreground">
            {explainItem.sectionTitle}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-[10px]">
              {explainItem.levelCode}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {explainItem.itemCells.join(" · ")}
            </span>
          </div>
          {content.model_used && (
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground/70">
              <Sparkles size={10} />
              <span>{formatModelName(content.model_used)}</span>
            </div>
          )}
        </div>
        <div className="p-4">
          {explanationData ? (
            <AIExplanationView data={explanationData} />
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none text-sm text-muted-foreground">
              {content.response_text}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <EmptyState
      icon={<Lightbulb size={28} className="text-brand" />}
      title="Explain Mode"
      description="Open a section in Learn, then tap the Explain tab. Items will highlight — tap any one for an AI explanation."
    />
  );
}

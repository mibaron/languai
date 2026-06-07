"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bookmark, BookOpen, Cpu, HelpCircle, Lightbulb, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { generateAIContent, getCredit, listModels, saveAIContent } from "@/lib/api/ai";
import type {
  AIActionType,
  AIContentResponse,
  AIExamplesResponse,
  AIExplanationResponse,
  AIQuizResponse,
  LLMModelOption,
} from "@/types/ai-content";

import { AIExamplesView } from "./ai-examples-view";
import { AIExplanationView } from "./ai-explanation-view";
import { AIQuizView } from "./ai-quiz-view";
import { ModelSelect } from "./model-select";
import type { AIContentModalProps } from "./types";

const ACTION_BUTTONS = [
  { type: "examples" as const, label: "Examples", icon: BookOpen },
  { type: "quiz" as const, label: "Quiz", icon: HelpCircle },
  { type: "explanation" as const, label: "Explain", icon: Lightbulb },
];

export function AIContentModal({ open, onOpenChange, context }: AIContentModalProps) {
  const [content, setContent] = useState<AIContentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<AIActionType | null>(null);

  const [models, setModels] = useState<LLMModelOption[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [saveAsDefault, setSaveAsDefault] = useState(false);
  const [creditBalance, setCreditBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    listModels().then((data) => {
      setModels(data);
      const defaultModel = data.find((m) => m.is_default);
      if (defaultModel && !selectedModel) {
        setSelectedModel(defaultModel.model_id);
      }
    }).catch(() => {});
    getCredit().then((data) => {
      setCreditBalance(parseFloat(data.credit_balance));
    }).catch(() => {});
  }, [open]);

  const promptsRemaining = useMemo(() => {
    if (creditBalance === null || !selectedModel) return null;
    const model = models.find((m) => m.model_id === selectedModel);
    if (!model || model.approx_cost_eur <= 0) return null;
    return Math.floor(creditBalance / model.approx_cost_eur);
  }, [creditBalance, selectedModel, models]);

  const handleAction = useCallback(async (actionType: AIActionType) => {
    setIsLoading(true);
    setError(null);
    setActiveAction(actionType);
    setContent(null);
    setIsSaved(false);

    try {
      const response = await generateAIContent({
        level_code: context.levelCode,
        category: context.category,
        section_title: context.sectionTitle,
        section_headers: context.sectionHeaders,
        item_cells: context.itemCells,
        action_type: actionType,
        model: selectedModel || undefined,
        save_as_default: saveAsDefault || undefined,
      });
      setContent(response);
      setIsSaved(response.is_saved);
      getCredit().then((data) => setCreditBalance(parseFloat(data.credit_balance))).catch(() => {});
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { error?: { code?: string } } } };
      if (errorObj?.response?.data?.error?.code === "insufficient_credit") {
        setError("You're out of credit. This content hasn't been generated before for this model.");
        setCreditBalance(0);
      } else {
        setError("Failed to generate AI content. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [context, selectedModel, saveAsDefault]);

  const handleSave = useCallback(async () => {
    if (!content) return;
    try {
      await saveAIContent(content.id);
      setIsSaved(true);
    } catch {
      setError("Failed to save. Please try again.");
    }
  }, [content]);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (!nextOpen) {
      setContent(null);
      setError(null);
      setActiveAction(null);
      setIsSaved(false);
      setSaveAsDefault(false);
    }
    onOpenChange(nextOpen);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{context.sectionTitle}</DialogTitle>
          <DialogDescription>
            <Badge variant="secondary" className="mr-2">
              {context.levelCode}
            </Badge>
            {context.itemCells.join(" · ")}
          </DialogDescription>
        </DialogHeader>

        <Separator />

        {models.length > 0 && (
          <div className="space-y-2">
            <ModelSelect
              models={models}
              value={selectedModel}
              onChange={setSelectedModel}
              promptsRemaining={promptsRemaining}
            />
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={saveAsDefault}
                onChange={(e) => setSaveAsDefault(e.target.checked)}
                className="rounded border-input"
              />
              Save as my default model
            </label>
          </div>
        )}

        <div className="flex gap-2">
          {ACTION_BUTTONS.map(({ type, label, icon: Icon }) => (
            <Button
              key={type}
              variant={activeAction === type ? "default" : "outline"}
              size="sm"
              onClick={() => handleAction(type)}
              disabled={isLoading}
              className="flex-1"
            >
              <Icon className="mr-1.5 h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        {content && !isLoading && (
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Cpu className="h-3.5 w-3.5" />
              <span>Generated by</span>
              <Badge variant="outline" className="text-xs">
                {content.model_used}
              </Badge>
            </div>

            {content.action_type === "examples" && content.response_json && (
              <AIExamplesView data={content.response_json as AIExamplesResponse} />
            )}
            {content.action_type === "quiz" && content.response_json && (
              <AIQuizView data={content.response_json as AIQuizResponse} />
            )}
            {content.action_type === "explanation" && content.response_json && (
              <AIExplanationView data={content.response_json as AIExplanationResponse} />
            )}

            {!content.response_json && (
              <div className="whitespace-pre-wrap rounded-md border bg-muted/50 p-3 text-sm">
                {content.response_text}
              </div>
            )}

            <Button
              variant={isSaved ? "secondary" : "outline"}
              size="sm"
              onClick={handleSave}
              disabled={isSaved}
              className="w-full"
            >
              <Bookmark className="mr-1.5 h-4 w-4" />
              {isSaved ? "Saved" : "Save to my collection"}
            </Button>
          </div>
        )}

        {!content && !isLoading && !error && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Choose an action above to get AI-powered help with this item.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

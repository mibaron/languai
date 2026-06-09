"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BookOpen, HelpCircle, Lightbulb, Loader2, Plus } from "lucide-react";

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
import {
  aiContentDestroy,
  aiCreditRetrieve,
  aiGenerateCreate,
  aiItemContentCreate,
  aiModelsList,
  aiSaveCreate,
} from "@/lib/api/orval/api/generated/ai-content/ai-content";
import type { ActionTypeEnum, AIContent, CategoryEnum, LLMModel } from "@/lib/api/orval/api/generated/model";

import { AIContentCard } from "./ai-content-card";
import { ModelSelect } from "./model-select";
import type { AIContentModalProps } from "./types";

const ACTION_BUTTONS = [
  { type: "examples" as const, label: "Examples", icon: BookOpen },
  { type: "quiz" as const, label: "Quiz", icon: HelpCircle },
  { type: "explanation" as const, label: "Explain", icon: Lightbulb },
];

export function AIContentModal({ open, onOpenChange, context }: AIContentModalProps) {
  const [allContent, setAllContent] = useState<AIContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<ActionTypeEnum | null>(null);

  const [models, setModels] = useState<LLMModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [saveAsDefault, setSaveAsDefault] = useState(false);
  const [creditBalance, setCreditBalance] = useState<number | null>(null);

  const loadExistingContent = useCallback(async () => {
    setIsInitialLoading(true);
    try {
      const data = await aiItemContentCreate({
        level_code: context.levelCode,
        category: context.category,
        section_title: context.sectionTitle,
        item_cells: context.itemCells,
      });
      setAllContent(data);
      if (data.length > 0 && !activeAction) {
        setActiveAction(data[0].action_type);
      }
    } catch {
      // silent — empty state is fine
    } finally {
      setIsInitialLoading(false);
    }
  }, [context, activeAction]);

  useEffect(() => {
    if (!open) return;
    loadExistingContent();
    aiModelsList().then((data) => {
      setModels(data);
      const defaultModel = data.find((m) => m.is_default);
      if (defaultModel && !selectedModel) {
        setSelectedModel(defaultModel.model_id);
      }
    }).catch(() => {});
    aiCreditRetrieve().then((data) => {
      setCreditBalance(parseFloat(data.credit_balance));
    }).catch(() => {});
  }, [open]);

  const promptsRemaining = useMemo(() => {
    if (creditBalance === null || !selectedModel) return null;
    const model = models.find((m) => m.model_id === selectedModel);
    if (!model || model.approx_cost_eur <= 0) return null;
    return Math.floor(creditBalance / model.approx_cost_eur);
  }, [creditBalance, selectedModel, models]);

  const contentByAction = useMemo(() => {
    const map: Record<string, AIContent[]> = {};
    for (const c of allContent) {
      if (!map[c.action_type]) map[c.action_type] = [];
      map[c.action_type].push(c);
    }
    return map;
  }, [allContent]);

  const activeContent = activeAction ? contentByAction[activeAction] ?? [] : [];

  const hasContentForSelectedModel = activeAction
    ? activeContent.some((c) => c.model_used === selectedModel)
    : false;

  const handleGenerate = useCallback(async (actionType: ActionTypeEnum, regenerate = false) => {
    setIsLoading(true);
    setError(null);
    setActiveAction(actionType);

    try {
      const response = await aiGenerateCreate({
        level_code: context.levelCode,
        category: context.category as CategoryEnum,
        section_title: context.sectionTitle,
        section_headers: context.sectionHeaders,
        item_cells: context.itemCells,
        action_type: actionType,
        model: selectedModel || undefined,
        save_as_default: saveAsDefault || undefined,
        regenerate: regenerate || undefined,
      });

      setAllContent((prev) => {
        if (regenerate) {
          const filtered = prev.filter(
            (c) => !(c.action_type === actionType && c.model_used === response.model_used)
          );
          return [response, ...filtered];
        }
        const exists = prev.some((c) => c.id === response.id);
        if (exists) return prev;
        return [response, ...prev];
      });

      aiCreditRetrieve().then((data) => setCreditBalance(parseFloat(data.credit_balance))).catch(() => {});
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

  const handleDelete = useCallback(async (id: string) => {
    setIsDeleting(true);
    try {
      await aiContentDestroy(id);
      setAllContent((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError("Failed to delete. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }, []);

  const handleRegenerate = useCallback(async (content: AIContent) => {
    setSelectedModel(content.model_used);
    await handleGenerate(content.action_type, true);
  }, [handleGenerate]);

  const handleSave = useCallback(async (id: string) => {
    await aiSaveCreate(id);
  }, []);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (!nextOpen) {
      setAllContent([]);
      setError(null);
      setActiveAction(null);
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
          {ACTION_BUTTONS.map(({ type, label, icon: Icon }) => {
            const count = contentByAction[type]?.length ?? 0;
            return (
              <Button
                key={type}
                variant={activeAction === type ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (activeAction === type) return;
                  setActiveAction(type);
                  setError(null);
                }}
                disabled={isLoading}
                className="flex-1 gap-1.5"
              >
                <Icon className="h-4 w-4" />
                {label}
                {count > 0 && (
                  <Badge
                    variant={activeAction === type ? "secondary" : "outline"}
                    className="ml-1 h-5 min-w-5 px-1 text-[10px]"
                  >
                    {count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        {isInitialLoading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        {activeAction && !isInitialLoading && (
          <div className="space-y-3">
            {activeContent.map((c) => (
              <AIContentCard
                key={c.id}
                content={c}
                onSave={handleSave}
                onDelete={handleDelete}
                onRegenerate={handleRegenerate}
                isDeleting={isDeleting}
              />
            ))}

            {isLoading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}

            {!isLoading && !hasContentForSelectedModel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGenerate(activeAction)}
                className="w-full"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Generate with {models.find((m) => m.model_id === selectedModel)?.name ?? selectedModel}
              </Button>
            )}

            {!isLoading && activeContent.length === 0 && (
              <p className="py-2 text-center text-sm text-muted-foreground">
                No content generated yet. Click the button above to generate.
              </p>
            )}
          </div>
        )}

        {!activeAction && !isInitialLoading && allContent.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Choose an action above to get AI-powered help with this item.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

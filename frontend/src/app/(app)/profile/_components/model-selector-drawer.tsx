"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

import { BottomDrawer } from "@/components/composites/bottom-drawer";
import { useAiModelsList } from "@/lib/api/orval/api/generated/ai-content/ai-content";
import { cn } from "@/lib/utils";

import type { ModelSelectorDrawerProps } from "./types";

function ModelSelectorForm({
  currentModelId,
  onSave,
  onClose,
  isSaving,
}: Omit<ModelSelectorDrawerProps, "open">) {
  const [selected, setSelected] = useState<string | null>(currentModelId);
  const { data: models, isLoading } = useAiModelsList();

  return (
    <>
      <div className="px-4 pb-2">
        <h3 className="text-base font-semibold text-foreground">
          AI Model
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Select your preferred model for AI explanations
        </p>
      </div>

      <div className="max-h-[50vh] overflow-y-auto px-4 py-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <button
              onClick={() => setSelected(null)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm",
                selected === null
                  ? "bg-brand-muted font-medium text-brand"
                  : "text-foreground",
              )}
            >
              <div>
                <div>Platform Default</div>
                <div className="text-[10px] text-muted-foreground">
                  Uses the system default model
                </div>
              </div>
              {selected === null && <Check size={16} />}
            </button>
            {models?.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelected(model.model_id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm",
                  selected === model.model_id
                    ? "bg-brand-muted font-medium text-brand"
                    : "text-foreground",
                )}
              >
                <div>
                  <div>{model.name}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {model.provider} · ~€{model.approx_cost_eur.toFixed(4)}/request
                  </div>
                </div>
                {selected === model.model_id && <Check size={16} />}
              </button>
            ))}
          </>
        )}
      </div>

      <div className="flex gap-3 px-4 pb-4 pt-2">
        <button
          onClick={onClose}
          disabled={isSaving}
          className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(selected)}
          disabled={isSaving || selected === currentModelId}
          className="flex-1 rounded-lg bg-brand py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}

export function ModelSelectorDrawer({
  open,
  ...formProps
}: ModelSelectorDrawerProps) {
  return (
    <BottomDrawer open={open} onClose={formProps.onClose}>
      {open && <ModelSelectorForm {...formProps} />}
    </BottomDrawer>
  );
}

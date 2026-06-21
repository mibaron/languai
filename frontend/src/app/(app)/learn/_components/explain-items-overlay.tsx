"use client";

import type { PageLexicalItem } from "@/lib/api/orval/api/generated/model";
import type { CategoryEnum } from "@/lib/api/orval/api/generated/model/categoryEnum";
import { Sparkles } from "lucide-react";
import { AIItemContext } from "@/types/ai-content";

const itemTypeToCategory: Record<string, CategoryEnum> = {
  vocab: "vocab",
  verb: "verbs",
  phrase: "phrases",
  grammar_rule: "grammar",
};

interface ExplainItemsOverlayProps {
  items: readonly PageLexicalItem[];
  pageTitle: string;
  levelCode: string;
  onExplain: (context: AIItemContext) => void;
  onClose: () => void;
}

export function ExplainItemsOverlay({
  onExplain,
  onClose,
  levelCode,
  pageTitle,
  items,
}: ExplainItemsOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 mb-13 flex-row items-end justify-center bg-black/50">
      <div className="fixed bottom-13 w-full max-w-md justify-self-center border-t bg-black px-4 py-4">
        <div className="mb-8 flex flex-row justify-between">
          <div className="text-brand flex items-center gap-1.5 text-xs font-medium">
            <Sparkles size={14} /> Tap any item for an AI explanation{" "}
          </div>
          <button
            onClick={() => onClose()}
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            Close{" "}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map((li) => (
            <button
              key={li.item_id}
              onClick={() =>
                onExplain({
                  levelCode,
                  category: itemTypeToCategory[li.type] ?? "vocab",
                  sectionTitle: pageTitle,
                  itemCells: [li.text, li.translation],
                  itemOrder: li.order ?? 0,
                })
              }
              className="border-brand/40 bg-background text-foreground hover:bg-brand/10 active:bg-brand/20 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
            >
              {" "}
              {li.display_label || li.text}
            </button>
          ))}{" "}
        </div>
      </div>
    </div>
  );
}

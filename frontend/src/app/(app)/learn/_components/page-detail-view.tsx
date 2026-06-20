"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

import { useExplainModeContext } from "@/contexts/explain-mode-context";

import { PageDetailHeader } from "./page-detail-header";
import { PagePartRenderer } from "./page-part-renderer";
import type { PageDetailViewProps } from "./types";
import { ExplainItemsOverlay } from "./explain-items-overlay";

export function PageDetailView({
  page,
  pageIndex,
  totalPages,
  levelCode,
  onBack,
  onNavigate,
  onMarkStudied,
  isMarkingStudied,
}: PageDetailViewProps) {
  const { explainMode, isExplaining, triggerExplain, exitExplainMode, setHasExplainableContent } =
    useExplainModeContext();
  const hasPrev = pageIndex > 0;
  const hasNext = pageIndex < totalPages - 1;
  const hasLexicalItems = page.lexical_items.length > 0;

  useEffect(() => {
    setHasExplainableContent(hasLexicalItems);
    return () => setHasExplainableContent(false);
  }, [hasLexicalItems, setHasExplainableContent]);

  const fillBlankPartIds = useMemo(
    () => page.parts.filter((p) => p.part_type === "fill_blank" && p.detail).map((p) => p.id),
    [page.parts],
  );

  const [completedParts, setCompletedParts] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCompletedParts(new Set());
  }, [page.id]);

  const handleFillBlankComplete = useCallback((partId: string) => {
    setCompletedParts((prev) => new Set(prev).add(partId));
  }, []);

  const allInteractiveComplete =
    fillBlankPartIds.length === 0 || fillBlankPartIds.every((id) => completedParts.has(id));

  const handleDone = () => {
    onMarkStudied();
    if (hasNext) {
      onNavigate(pageIndex + 1);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <PageDetailHeader
        title={page.title}
        pageIndex={pageIndex}
        totalPages={totalPages}
        isStudied={page.is_studied}
        onBack={onBack}
        onPrev={() => onNavigate(pageIndex - 1)}
        onNext={() => onNavigate(pageIndex + 1)}
        hasPrev={hasPrev}
        hasNext={hasNext}
      />

      <div key={page.id} className="flex-1 space-y-4 overflow-y-auto p-4">
        {page.description && (
          <p className="text-sm text-muted-foreground">{page.description}</p>
        )}

        {page.parts.map((part) => (
          <PagePartRenderer
            key={part.id}
            part={part}
            onFillBlankComplete={handleFillBlankComplete}
          />
        ))}

        {explainMode && hasLexicalItems && !isExplaining && (
          <ExplainItemsOverlay
            items={page.lexical_items}
            pageTitle={page.title}
            levelCode={levelCode}
            onExplain={triggerExplain}
            onClose={exitExplainMode}
          />
        )}

        {!page.is_studied && (
          <div className="pt-2 pb-4">
            <button
              onClick={handleDone}
              disabled={isMarkingStudied || !allInteractiveComplete}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white",
                "disabled:opacity-60",
              )}
            >
              {isMarkingStudied ? (
                <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : hasNext ? (
                <ArrowRight size={18} />
              ) : (
                <CheckCircle size={18} />
              )}
              {hasNext ? "Done — Next" : "Done"}
            </button>
          </div>
        )}

        {page.is_studied && hasNext && (
          <div className="pt-2 pb-4">
            <button
              onClick={() => onNavigate(pageIndex + 1)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground"
            >
              <ArrowRight size={18} />
              Next Page
            </button>
          </div>
        )}

        {page.is_studied && !hasNext && (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-green-600 dark:text-green-400">
            <CheckCircle size={16} />
            <span className="font-medium">All done!</span>
          </div>
        )}
      </div>
    </div>
  );
}

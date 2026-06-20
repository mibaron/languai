"use client";

import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import { useExplainModeContext } from "@/contexts/explain-mode-context";

import { PageDetailHeader } from "./page-detail-header";
import { PagePartRenderer } from "./page-part-renderer";
import type { PageDetailViewProps } from "./types";

export function PageDetailView({
  page,
  pageIndex,
  totalPages,
  onBack,
  onNavigate,
  onMarkStudied,
  isMarkingStudied,
}: PageDetailViewProps) {
  const { setHasExplainableContent } = useExplainModeContext();
  const hasPrev = pageIndex > 0;
  const hasNext = pageIndex < totalPages - 1;
  const hasLexicalItems = page.lexical_items.length > 0;

  useEffect(() => {
    setHasExplainableContent(hasLexicalItems);
    return () => setHasExplainableContent(false);
  }, [hasLexicalItems, setHasExplainableContent]);

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
          <PagePartRenderer key={part.id} part={part} />
        ))}

        {!page.is_studied && (
          <div className="pt-2 pb-4">
            <button
              onClick={onMarkStudied}
              disabled={isMarkingStudied}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white",
                "disabled:opacity-60",
              )}
            >
              {isMarkingStudied ? (
                <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <CheckCircle size={18} />
              )}
              Mark as Studied
            </button>
          </div>
        )}

        {page.is_studied && (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-green-600 dark:text-green-400">
            <CheckCircle size={16} />
            <span className="font-medium">Studied</span>
          </div>
        )}
      </div>
    </div>
  );
}

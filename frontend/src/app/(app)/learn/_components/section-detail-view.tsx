"use client";

import { useEffect } from "react";

import { SectionCard as SectionContent } from "@/components/learning/section-card";
import { useExplainModeContext } from "@/contexts/explain-mode-context";
import { useSectionsRetrieve } from "@/lib/api/orval/api/generated/sections/sections";

import { SectionDetailHeader } from "./section-detail-header";
import type { SectionDetailViewProps } from "./types";

export function SectionDetailView({
  sectionId,
  sectionIndex,
  totalSections,
  levelCode,
  category,
  onBack,
  onNavigate,
}: SectionDetailViewProps) {
  const { data: section, isLoading } = useSectionsRetrieve(sectionId);
  const { explainMode, isExplaining, triggerExplain, setHasExplainableContent } =
    useExplainModeContext();
  const hasPrev = sectionIndex > 0;
  const hasNext = sectionIndex < totalSections - 1;

  useEffect(() => {
    setHasExplainableContent(true);
    return () => setHasExplainableContent(false);
  }, [setHasExplainableContent]);

  if (isLoading || !section) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <SectionDetailHeader
        title={section.title}
        sectionIndex={sectionIndex}
        totalSections={totalSections}
        onBack={onBack}
        onPrev={() => onNavigate(sectionIndex - 1)}
        onNext={() => onNavigate(sectionIndex + 1)}
        hasPrev={hasPrev}
        hasNext={hasNext}
      />
      <div key={sectionIndex} className="flex-1 overflow-y-auto p-4">
        <SectionContent
          section={{
            title: section.title,
            type: section.content_type,
            note: section.note,
            note2: section.note2,
            headers: [...section.headers],
            items: section.items.map((item) => ({
              id: item.id,
              order: item.order ?? 0,
              cells: [...item.cells],
            })),
          }}
          levelCode={levelCode}
          category={category}
          explainMode={explainMode && !isExplaining}
          onExplainItem={triggerExplain}
        />
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";

import { SectionCard as SectionContent } from "@/components/learning/section-card";
import { useExplainModeContext } from "@/contexts/explain-mode-context";

import { SectionDetailHeader } from "./section-detail-header";
import type { SectionDetailViewProps } from "./types";

export function SectionDetailView({
  section,
  sectionIndex,
  totalSections,
  levelCode,
  category,
  onBack,
  onNavigate,
}: SectionDetailViewProps) {
  const { explainMode, isExplaining, triggerExplain, setHasExplainableContent } =
    useExplainModeContext();
  const hasPrev = sectionIndex > 0;
  const hasNext = sectionIndex < totalSections - 1;

  useEffect(() => {
    setHasExplainableContent(true);
    return () => setHasExplainableContent(false);
  }, [setHasExplainableContent]);

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
          section={section}
          levelCode={levelCode}
          category={category}
          explainMode={explainMode && !isExplaining}
          onExplainItem={triggerExplain}
        />
      </div>
    </div>
  );
}

"use client";

import { SectionCard as SectionContent } from "@/components/learning/section-card";

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
  const hasPrev = sectionIndex > 0;
  const hasNext = sectionIndex < totalSections - 1;

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
        />
      </div>
    </div>
  );
}

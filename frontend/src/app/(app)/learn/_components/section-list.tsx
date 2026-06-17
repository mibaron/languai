import { SectionCard } from "./section-card";
import type { SectionListProps } from "./types";

export function SectionList({ sections, onOpenSection }: SectionListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {sections.map((section) => (
        <SectionCard
          key={section.title}
          section={section}
          onOpen={onOpenSection}
        />
      ))}
    </div>
  );
}

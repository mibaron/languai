"use client";

import { SectionCard } from "./section-card";
import type { SectionListProps } from "./types";

export function SectionList({ sections }: SectionListProps) {
  if (sections.length === 0) {
    return (
      <p className="py-8 text-center text-stone-400">Keine Ergebnisse.</p>
    );
  }

  return (
    <>
      {sections.map((section, i) => (
        <SectionCard key={i} section={section} />
      ))}
    </>
  );
}

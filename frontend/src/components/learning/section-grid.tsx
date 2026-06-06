import { AIButton } from "@/components/ai/ai-button";

import type { SectionGridProps } from "./types";

export function SectionGrid({ items, sectionTitle, levelCode, category }: SectionGridProps) {
  return (
    <div className="grid gap-2">
      {items.map((item, i) => (
        <div key={item.id ?? i} className="flex items-center gap-1.5">
          <div className="grid flex-1 grid-cols-3 gap-1.5 sm:grid-cols-6">
            {item.cells.map((cell, j) =>
              cell ? (
                <div
                  key={j}
                  className="rounded-md border bg-muted/50 px-2 py-1.5 text-center text-sm font-medium"
                >
                  {cell}
                </div>
              ) : (
                <div key={j} />
              ),
            )}
          </div>
          <AIButton
            context={{
              levelCode,
              category,
              sectionTitle,
              itemOrder: item.order ?? i,
              itemCells: item.cells.filter(Boolean),
            }}
          />
        </div>
      ))}
    </div>
  );
}

import { cn } from "@/lib/utils";

import type { SectionGridProps } from "./types";

export function SectionGrid({
  items,
  sectionTitle,
  levelCode,
  category,
  explainMode,
  onExplainItem,
}: SectionGridProps) {
  return (
    <div className="grid gap-2">
      {items.map((item, i) => (
        <div
          key={item.id ?? i}
          onClick={
            explainMode
              ? () =>
                  onExplainItem?.({
                    levelCode,
                    category,
                    sectionTitle,
                    itemOrder: item.order ?? i,
                    itemCells: item.cells.filter(Boolean),
                  })
              : undefined
          }
          className={cn(
            "grid flex-1 grid-cols-3 gap-1.5 sm:grid-cols-6",
            explainMode &&
              "cursor-pointer rounded-md ring-1 ring-brand/30 bg-brand/5 p-1 hover:bg-brand/10",
          )}
        >
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
      ))}
    </div>
  );
}

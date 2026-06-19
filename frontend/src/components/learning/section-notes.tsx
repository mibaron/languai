import { cn } from "@/lib/utils";

import type { SectionNotesProps } from "./types";

export function SectionNotes({
  items,
  sectionTitle,
  levelCode,
  category,
  explainMode,
  onExplainItem,
}: SectionNotesProps) {
  return (
    <div className="space-y-0 rounded-md border divide-y">
      {items.map((item, i) => {
        const text = item.cells[0] ?? "";
        const isDivider = text.startsWith("─");
        const isExplainable = explainMode && !isDivider;

        return (
          <div
            key={item.id ?? i}
            onClick={
              isExplainable
                ? () =>
                    onExplainItem?.({
                      levelCode,
                      category,
                      sectionTitle,
                      itemOrder: item.order ?? i,
                      itemCells: item.cells,
                    })
                : undefined
            }
            className={cn(
              "flex items-center justify-between gap-2 px-3 py-2 text-sm leading-relaxed",
              isDivider
                ? "bg-muted/50 font-semibold text-foreground"
                : "text-muted-foreground",
              isExplainable &&
                "cursor-pointer ring-1 ring-brand/30 bg-brand/5 hover:bg-brand/10",
            )}
          >
            <span className="flex-1">{text}</span>
          </div>
        );
      })}
    </div>
  );
}

import { AIButton } from "@/components/ai/ai-button";
import { cn } from "@/lib/utils";

import type { SectionNotesProps } from "./types";

export function SectionNotes({ items, sectionTitle, levelCode, category }: SectionNotesProps) {
  return (
    <div className="space-y-0 rounded-md border divide-y">
      {items.map((item, i) => {
        const text = item.cells[0] ?? "";
        const isDivider = text.startsWith("─");
        return (
          <div
            key={item.id ?? i}
            className={cn(
              "flex items-center justify-between gap-2 px-3 py-2 text-sm leading-relaxed",
              isDivider
                ? "bg-muted/50 font-semibold text-foreground"
                : "text-muted-foreground",
            )}
          >
            <span className="flex-1">{text}</span>
            {!isDivider && (
              <AIButton
                context={{
                  levelCode,
                  category,
                  sectionTitle,
                  itemOrder: item.order ?? i,
                  itemCells: item.cells,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

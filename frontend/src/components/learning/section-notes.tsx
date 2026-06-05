import { cn } from "@/lib/utils";

import type { SectionNotesProps } from "./types";

export function SectionNotes({ items }: SectionNotesProps) {
  return (
    <ul className="m-0 list-none p-0">
      {items.map((item, i) => {
        const text = item.cells[0] ?? "";
        return (
          <li
            key={item.id ?? i}
            className={cn(
              "px-2 py-1.5 text-sm leading-relaxed text-emerald-950",
              i < items.length - 1 && "border-b border-stone-200",
              text.startsWith("─") && "font-serif font-bold",
            )}
          >
            {text}
          </li>
        );
      })}
    </ul>
  );
}

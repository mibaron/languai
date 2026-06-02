import { cn } from "@/lib/utils";

import type { SectionNotesProps } from "./types";

export function SectionNotes({ notes }: SectionNotesProps) {
  return (
    <ul className="m-0 list-none p-0">
      {notes.map((note, i) => (
        <li
          key={i}
          className={cn(
            "px-2 py-1.5 text-sm leading-relaxed text-emerald-950",
            i < notes.length - 1 && "border-b border-stone-200",
            note.startsWith("─") && "font-serif font-bold",
          )}
        >
          {note}
        </li>
      ))}
    </ul>
  );
}

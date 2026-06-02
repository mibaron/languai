import { cn } from "@/lib/utils";

import type { NoteBoxProps } from "./types";

export function NoteBox({ text, variant = "info" }: NoteBoxProps) {
  return (
    <div
      className={cn(
        "mb-2.5 rounded-md border px-3 py-1.5 text-sm leading-relaxed",
        variant === "warning"
          ? "border-amber-300 bg-amber-50 text-amber-800"
          : "border-emerald-300 bg-emerald-50 text-emerald-900",
      )}
    >
      {text}
    </div>
  );
}

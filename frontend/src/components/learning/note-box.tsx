import { Info, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

import type { NoteBoxProps } from "./types";

export function NoteBox({ text, variant = "info" }: NoteBoxProps) {
  const Icon = variant === "warning" ? TriangleAlert : Info;

  return (
    <div
      className={cn(
        "mb-3 flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm leading-relaxed",
        variant === "warning"
          ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-200"
          : "border-blue-500/30 bg-blue-500/10 text-blue-200",
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 opacity-60" />
      <span>{text}</span>
    </div>
  );
}

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ConversationDetail, ConversationLine } from "@/lib/api/orval/api/generated/model";

interface ConversationRendererProps {
  detail: ConversationDetail;
}

function BlankInput({ line }: { line: ConversationLine }) {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const isCorrect =
    value.trim().toLowerCase() === (line.blank_answer ?? "").toLowerCase();

  return (
    <span className="inline-flex items-baseline gap-0.5">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setChecked(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim()) setChecked(true);
        }}
        placeholder="___"
        className={cn(
          "w-20 border-b-2 bg-transparent px-0.5 text-center text-sm font-medium outline-none",
          !checked && "border-brand/40",
          checked && isCorrect && "border-green-500 text-green-700 dark:text-green-400",
          checked && !isCorrect && "border-red-500 text-red-700 dark:text-red-400",
        )}
      />
    </span>
  );
}

export function ConversationRenderer({ detail }: ConversationRendererProps) {
  const [showTranslations, setShowTranslations] = useState(false);

  return (
    <div className="rounded-lg border border-border p-4">
      {detail.context && (
        <p className="mb-3 text-xs font-medium text-muted-foreground">
          {detail.context}
        </p>
      )}

      <div className="space-y-3">
        {detail.lines.map((line) => (
          <div key={line.id} className="flex gap-2">
            <span className="shrink-0 text-xs font-semibold text-brand">
              {line.speaker}:
            </span>
            <div className="text-sm text-foreground">
              {line.is_blank ? (
                <BlankInput line={line} />
              ) : (
                <span>{line.text}</span>
              )}
              {showTranslations && line.translation && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({line.translation})
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowTranslations((v) => !v)}
        className="mt-3 text-xs font-medium text-brand hover:underline"
      >
        {showTranslations ? "Hide translations" : "Show translations"}
      </button>
    </div>
  );
}

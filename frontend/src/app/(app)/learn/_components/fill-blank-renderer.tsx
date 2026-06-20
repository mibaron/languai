"use client";

import { useState } from "react";
import { Check, Eye, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FillBlankDetail } from "@/lib/api/orval/api/generated/model";

interface FillBlankRendererProps {
  detail: FillBlankDetail;
  onComplete?: () => void;
}

export function FillBlankRenderer({ detail, onComplete }: FillBlankRendererProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const isCorrect =
    userAnswer.trim().toLowerCase() === detail.answer.toLowerCase();

  const handleCheck = () => {
    if (userAnswer.trim()) {
      setChecked(true);
      if (userAnswer.trim().toLowerCase() === detail.answer.toLowerCase()) {
        onComplete?.();
      }
    }
  };

  const handleReveal = () => {
    setRevealed(true);
    setUserAnswer(detail.answer);
    setChecked(true);
    onComplete?.();
  };

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex flex-wrap items-baseline gap-1.5 text-sm">
        <span className="text-foreground">{detail.text_before}</span>
        <div className="inline-flex items-center gap-1.5">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => {
              setUserAnswer(e.target.value);
              setChecked(false);
              setRevealed(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            placeholder="..."
            className={cn(
              "w-28 border-b-2 bg-transparent px-1 py-0.5 text-center text-sm font-medium outline-none",
              !checked && "border-brand/40 focus:border-brand",
              checked && isCorrect && "border-green-500 text-green-700 dark:text-green-400",
              checked && !isCorrect && !revealed && "border-red-500 text-red-700 dark:text-red-400",
              revealed && "border-amber-500 text-amber-700 dark:text-amber-400",
            )}
          />
          {checked && isCorrect && <Check size={16} className="text-green-600" />}
          {checked && !isCorrect && !revealed && <X size={16} className="text-red-500" />}
        </div>
        <span className="text-foreground">{detail.text_after}</span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={handleCheck}
          disabled={!userAnswer.trim() || (checked && isCorrect)}
          className="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40"
        >
          Check
        </button>
        {!isCorrect && !revealed && (
          <button
            onClick={handleReveal}
            className="flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
          >
            <Eye size={14} />
            Show
          </button>
        )}
      </div>

      {detail.hint && !checked && (
        <p className="mt-2 text-xs text-muted-foreground">
          Hint: {detail.hint}
        </p>
      )}
    </div>
  );
}

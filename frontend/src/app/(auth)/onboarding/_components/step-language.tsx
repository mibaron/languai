"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

import type { StepLanguageProps } from "./types";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "fa", name: "Persian" },
  { code: "tr", name: "Turkish" },
  { code: "ar", name: "Arabic" },
];

export function StepLanguage({
  selectedLanguages,
  primaryLanguage,
  onToggle,
}: StepLanguageProps) {
  return (
    <div className="px-5 pt-6">
      <h2 className="mb-2 text-[22px] font-bold tracking-[-0.02em] text-foreground">
        What language do you speak?
      </h2>
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        Select up to 3. Your first choice becomes the primary language for
        explanations.
      </p>
      <div className="flex flex-col gap-2.5">
        {LANGUAGES.map((lang) => {
          const selected = selectedLanguages.includes(lang.code);
          const isPrimary =
            primaryLanguage === lang.code && selectedLanguages.length > 1;

          return (
            <button
              key={lang.code}
              onClick={() => onToggle(lang.code)}
              className={cn(
                "flex w-full items-center gap-3 rounded-[14px] px-4 py-3.5 text-left transition-all",
                selected
                  ? "border-2 border-brand bg-brand-muted"
                  : "border-[1.5px] border-border bg-background",
              )}
            >
              <div className="flex-1">
                <div
                  className={cn(
                    "text-[15px]",
                    selected
                      ? "font-semibold text-brand-light"
                      : "text-foreground",
                  )}
                >
                  {lang.name}
                </div>
                {isPrimary && (
                  <div className="mt-0.5 text-[11px] font-medium text-brand">
                    Primary language
                  </div>
                )}
              </div>
              {selected ? (
                <div className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-brand">
                  <Check className="size-3 text-white" strokeWidth={2.5} />
                </div>
              ) : (
                <div className="size-[22px] shrink-0 rounded-full border-[1.5px] border-border" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

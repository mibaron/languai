"use client";

import { Check, Lock } from "lucide-react";

import { cn } from "@/lib/utils";

const TARGET_LANGUAGES = [
  { code: "de", name: "German", label: "DE", available: true },
  { code: "es", name: "Spanish", label: "ES", available: false },
  { code: "fr", name: "French", label: "FR", available: false },
  { code: "it", name: "Italian", label: "IT", available: false },
];

export function StepTarget() {
  return (
    <div className="px-5 pt-6">
      <h2 className="mb-2 text-[22px] font-bold tracking-[-0.02em] text-foreground">
        What do you want to learn?
      </h2>
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        German is available now. More languages are on the way.
      </p>
      <div className="flex flex-col gap-2.5">
        {TARGET_LANGUAGES.map((lang) => (
          <div
            key={lang.code}
            className={cn(
              "flex items-center gap-3.5 rounded-[14px] px-4 py-3.5",
              lang.available
                ? "border-2 border-brand bg-brand-muted"
                : "border-[1.5px] border-border bg-muted/50 opacity-55",
            )}
          >
            <div
              className={cn(
                "flex size-[42px] shrink-0 items-center justify-center rounded-[11px]",
                lang.available ? "bg-brand" : "bg-muted",
              )}
            >
              <span
                className={cn(
                  "text-[13px] font-bold",
                  lang.available ? "text-white" : "text-muted-foreground",
                )}
              >
                {lang.label}
              </span>
            </div>
            <div className="flex-1">
              <div
                className={cn(
                  "text-[15px]",
                  lang.available
                    ? "font-semibold text-brand-light"
                    : "text-foreground",
                )}
              >
                {lang.name}
              </div>
              {!lang.available && (
                <div className="mt-0.5 text-xs text-muted-foreground">
                  Coming soon
                </div>
              )}
            </div>
            {lang.available ? (
              <div className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-brand">
                <Check className="size-3 text-white" strokeWidth={2.5} />
              </div>
            ) : (
              <Lock className="size-4 text-border" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

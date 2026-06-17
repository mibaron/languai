"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { BottomDrawer } from "@/components/composites/bottom-drawer";
import { cn } from "@/lib/utils";

import type { LanguageDrawerProps } from "./types";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "de", label: "German" },
  { code: "fa", label: "Persian" },
  { code: "ar", label: "Arabic" },
  { code: "tr", label: "Turkish" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "it", label: "Italian" },
  { code: "pt", label: "Portuguese" },
  { code: "ru", label: "Russian" },
  { code: "zh", label: "Chinese" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
];

function LanguageForm({
  mode,
  currentValue,
  onSave,
  onClose,
  isSaving,
}: Omit<LanguageDrawerProps, "open">) {
  const [selected, setSelected] = useState(currentValue);

  const title = mode === "speaks" ? "I Speak" : "I'm Learning";
  const description =
    mode === "speaks"
      ? "Select your native language"
      : "Select the language you want to learn";

  return (
    <>
      <div className="px-4 pb-2">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>

      <div className="max-h-[50vh] overflow-y-auto px-4 py-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setSelected(lang.code)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm",
              selected === lang.code
                ? "bg-brand-muted font-medium text-brand"
                : "text-foreground",
            )}
          >
            {lang.label}
            {selected === lang.code && <Check size={16} />}
          </button>
        ))}
      </div>

      <div className="flex gap-3 px-4 pb-4 pt-2">
        <button
          onClick={onClose}
          disabled={isSaving}
          className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(selected)}
          disabled={isSaving || selected === currentValue}
          className="flex-1 rounded-lg bg-brand py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}

export function LanguageDrawer({ open, ...formProps }: LanguageDrawerProps) {
  return (
    <BottomDrawer open={open} onClose={formProps.onClose}>
      {open && <LanguageForm {...formProps} />}
    </BottomDrawer>
  );
}

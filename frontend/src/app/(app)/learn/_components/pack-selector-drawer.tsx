"use client";

import Link from "next/link";
import { Check, Archive, ChevronRight, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

import type { PackSelectorDrawerProps } from "./types";

export function PackSelectorDrawer({
  packs,
  activePackId,
  onSelect,
  onClose,
}: PackSelectorDrawerProps) {
  return (
    <div
      className="absolute inset-0 z-[200] flex flex-col justify-end bg-black/35"
      onClick={onClose}
    >
      <div
        className="rounded-t-[20px] bg-background"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-1 mt-3 h-1 w-9 rounded-full bg-muted" />
        <div className="flex items-center justify-between border-b border-border/50 px-5 pb-3 pt-1.5">
          <div className="text-xs font-semibold uppercase tracking-[0.07em] text-muted-foreground">
            Switch Pack
          </div>
          <button className="flex items-center gap-1 rounded-full border border-brand/30 bg-brand-muted px-2.5 py-1">
            <Compass size={12} className="text-brand" />
            <span className="text-xs font-semibold text-brand">
              Browse all
            </span>
          </button>
        </div>
        {packs.map((sub) => {
          const isActive = activePackId === sub.pack.id;
          return (
            <button
              key={sub.id}
              onClick={() => onSelect(sub.pack.id)}
              className={cn(
                "flex w-full items-center gap-3 border-t border-border/50 px-5 py-3.5",
                isActive && "bg-brand-muted",
              )}
            >
              <div className="flex-1 text-left">
                <div
                  className={cn(
                    "text-[15px] font-semibold",
                    isActive ? "text-brand" : "text-foreground",
                  )}
                >
                  {sub.pack.title}
                </div>
                <div className="mt-px text-xs text-muted-foreground">
                  in {sub.pack.base_language} &middot;{" "}
                  {sub.pack.level_code}
                </div>
              </div>
              {isActive && <Check size={18} className="text-brand" />}
            </button>
          );
        })}
        <Link
          href="/archived-packs"
          onClick={onClose}
          className="flex w-full items-center gap-3 border-t-[1.5px] border-border/70 px-5 py-[13px]"
        >
          <Archive size={16} className="text-muted-foreground" />
          <span className="flex-1 text-left text-[13px] text-muted-foreground">
            Archived Packs
          </span>
          <ChevronRight size={14} className="text-muted-foreground/40" />
        </Link>
        <div className="h-[34px]" />
      </div>
    </div>
  );
}

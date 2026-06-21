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
    <div className="absolute inset-0 z-2 flex flex-col justify-end bg-black/35" onClick={onClose}>
      <div className="bg-background rounded-t-[20px]" onClick={(e) => e.stopPropagation()}>
        <div className="bg-muted mx-auto mt-3 mb-1 h-1 w-9 rounded-full" />
        <div className="border-border/50 flex items-center justify-between border-b px-5 pt-1.5 pb-3">
          <div className="text-muted-foreground text-xs font-semibold tracking-[0.07em] uppercase">
            Switch Pack
          </div>
          <Link
            href="/profile"
            onClick={onClose}
            className="border-brand/30 bg-brand-muted flex items-center gap-1 rounded-full border px-2.5 py-1"
          >
            <Compass size={12} className="text-brand" />
            <span className="text-brand text-xs font-semibold">Browse all</span>
          </Link>
        </div>
        {packs.map((sub) => {
          const isActive = activePackId === sub.pack.id;
          return (
            <button
              key={sub.id}
              onClick={() => onSelect(sub.pack.id)}
              className={cn(
                "border-border/50 flex w-full items-center gap-3 border-t px-5 py-3.5",
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
                <div className="text-muted-foreground mt-px text-xs">
                  in {sub.pack.base_language} &middot; {sub.pack.level_code}
                </div>
              </div>
              {isActive && <Check size={18} className="text-brand" />}
            </button>
          );
        })}
        <Link
          href="/archived-packs"
          onClick={onClose}
          className="border-border/70 flex w-full items-center gap-3 border-t-[1.5px] px-5 py-[13px]"
        >
          <Archive size={16} className="text-muted-foreground" />
          <span className="text-muted-foreground flex-1 text-left text-[13px]">Archived Packs</span>
          <ChevronRight size={14} className="text-muted-foreground/40" />
        </Link>
        <div className="h-[34px]" />
      </div>
    </div>
  );
}

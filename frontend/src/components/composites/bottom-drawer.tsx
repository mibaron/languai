"use client";

import { cn } from "@/lib/utils";

import type { BottomDrawerProps } from "./types";

export function BottomDrawer({ open, onClose, children, className }: BottomDrawerProps) {
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-2 flex flex-col justify-end bg-black/35" onClick={onClose}>
      <div
        className={cn("bg-background rounded-t-[20px]", className)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-muted mx-auto mt-3 mb-1 h-1 w-9 rounded-full" />
        {children}
        <div className="h-8.5" />
      </div>
    </div>
  );
}

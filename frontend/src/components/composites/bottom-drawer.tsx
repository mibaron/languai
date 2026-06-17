"use client";

import { cn } from "@/lib/utils";

import type { BottomDrawerProps } from "./types";

export function BottomDrawer({
  open,
  onClose,
  children,
  className,
}: BottomDrawerProps) {
  if (!open) return null;

  return (
    <div
      className="absolute inset-0 z-[200] flex flex-col justify-end bg-black/35"
      onClick={onClose}
    >
      <div
        className={cn("rounded-t-[20px] bg-background", className)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-1 mt-3 h-1 w-9 rounded-full bg-muted" />
        {children}
        <div className="h-[34px]" />
      </div>
    </div>
  );
}

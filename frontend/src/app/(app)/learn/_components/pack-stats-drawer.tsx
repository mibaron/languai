"use client";

import { BottomDrawer } from "@/components/composites/bottom-drawer";
import { ProgressRing } from "@/components/composites/progress-ring";

import type { PackStatsDrawerProps } from "./types";

export function PackStatsDrawer({
  pack,
  open,
  onClose,
  totalPages,
  studiedPages,
  overallPercent,
  categories,
}: PackStatsDrawerProps) {
  const remaining = totalPages - studiedPages;

  return (
    <BottomDrawer open={open} onClose={onClose} className="max-h-[80%] overflow-y-auto">
      <div className="flex items-center gap-4 border-b border-border/50 px-5 pb-3.5 pt-2">
        <ProgressRing value={overallPercent} size={56} strokeWidth={4} />
        <div>
          <div className="text-base font-bold tracking-[-0.02em] text-foreground">
            {pack.title}
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            in {pack.base_language}
          </div>
          <div className="mt-1.5 flex gap-2.5">
            <span className="text-[11px] font-medium text-green-500">
              {studiedPages} studied
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">
              {remaining} remaining
            </span>
          </div>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-col gap-4 px-5 py-4">
          {categories.map((cat) => (
            <div key={cat.key}>
              <div className="mb-[7px] flex items-baseline justify-between">
                <span className="text-[13px] font-medium text-foreground">
                  {cat.label}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {cat.studied}/{cat.total} items &middot; {cat.percent}%
                </span>
              </div>
              <div className="h-[5px] overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-brand transition-all duration-300"
                  style={{ width: `${cat.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mx-5 mb-5 flex rounded-xl bg-muted/50 py-3.5">
        {[
          { val: totalPages, label: "Pages" },
          { val: studiedPages, label: "Studied" },
          { val: `${overallPercent}%`, label: "Complete" },
        ].map((item, i) => (
          <div
            key={item.label}
            className={`flex-1 text-center ${i < 2 ? "border-r border-border" : ""}`}
          >
            <div className="text-xl font-bold tracking-[-0.03em] text-foreground">
              {item.val}
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </BottomDrawer>
  );
}

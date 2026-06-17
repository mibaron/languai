import { cn } from "@/lib/utils";

import type { EmptyStateProps } from "./types";

export function EmptyState({
  icon,
  title,
  description,
  badge,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center px-7 py-8 text-center",
        className,
      )}
    >
      <div className="mb-5 flex size-16 items-center justify-center rounded-[20px] border-[1.5px] border-brand/30 bg-brand-muted">
        {icon}
      </div>
      <div className="mb-2 text-lg font-bold tracking-[-0.02em] text-foreground">
        {title}
      </div>
      <div className="max-w-[230px] text-sm leading-[1.65] text-muted-foreground">
        {description}
      </div>
      {badge && (
        <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-[5px] text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
          {badge}
        </div>
      )}
    </div>
  );
}

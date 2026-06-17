import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

import type { ProfileRowProps } from "./types";

export function ProfileRow({
  icon: Icon,
  label,
  value,
  last,
  onClick,
  action,
}: ProfileRowProps) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 px-3.5 py-[13px]",
        !last && "border-b border-border/50",
        onClick && "cursor-pointer text-left",
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-muted">
        <Icon size={16} className="text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm text-foreground">{label}</div>
        {value && (
          <div className="mt-0.5 text-xs text-muted-foreground/70">
            {value}
          </div>
        )}
      </div>
      {action ?? <ChevronRight size={16} className="text-muted-foreground/30" />}
    </Tag>
  );
}

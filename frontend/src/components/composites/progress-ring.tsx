import { cn } from "@/lib/utils";

import type { ProgressRingProps } from "./types";

export function ProgressRing({
  value,
  size = 50,
  strokeWidth = 3.5,
  className,
}: ProgressRingProps) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="absolute left-0 top-0 -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          className="stroke-muted"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          className="stroke-brand"
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="relative z-[1] text-[11px] font-bold tracking-[-0.02em] text-foreground">
        {value}%
      </span>
    </div>
  );
}

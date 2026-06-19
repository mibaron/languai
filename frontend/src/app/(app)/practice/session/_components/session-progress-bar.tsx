"use client";

interface SessionProgressBarProps {
  current: number;
  total: number;
}

export function SessionProgressBar({ current, total }: SessionProgressBarProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-brand transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs font-medium tabular-nums text-muted-foreground">
        {current}/{total}
      </span>
    </div>
  );
}

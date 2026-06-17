import type { ProfileSectionProps } from "./types";

export function ProfileSection({ title, children }: ProfileSectionProps) {
  return (
    <div>
      <div className="mb-2 pl-1 text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground">
        {title}
      </div>
      <div className="overflow-hidden rounded-[14px] border border-border bg-card">
        {children}
      </div>
    </div>
  );
}

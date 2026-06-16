import type { FeatureItem } from "./types";

export function FeatureCard({ icon, iconBg, title, description }: FeatureItem) {
  return (
    <div className="rounded-2xl border-[1.5px] border-border bg-card p-7 transition-all hover:border-brand-light/30 hover:shadow-[0_4px_24px_rgba(37,99,235,0.08)]">
      <div
        className="mb-4 flex size-[46px] items-center justify-center rounded-xl"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div className="mb-2 text-base font-semibold text-card-foreground">{title}</div>
      <div className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </div>
    </div>
  );
}

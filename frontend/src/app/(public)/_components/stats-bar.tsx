import type { StatItem } from "./types";

const STATS: StatItem[] = [
  { value: "A1 – B2", label: "All CEFR levels" },
  { value: "10,000+", label: "Vocabulary items" },
  { value: "4", label: "Native languages" },
  { value: "Free", label: "Core content, always" },
];

export function StatsBar() {
  return (
    <section className="border-t border-white/[0.08] bg-background px-6 py-7">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-12">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-2xl font-[800] tracking-tight text-foreground">
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

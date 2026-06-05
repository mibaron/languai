import type { SectionGridProps } from "./types";

export function SectionGrid({ items }: SectionGridProps) {
  return (
    <div className="grid gap-2">
      {items.map((item, i) => (
        <div key={item.id ?? i} className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
          {item.cells.map((cell, j) =>
            cell ? (
              <div
                key={j}
                className="rounded-md border bg-muted/50 px-2 py-1.5 text-center text-sm font-medium"
              >
                {cell}
              </div>
            ) : (
              <div key={j} />
            ),
          )}
        </div>
      ))}
    </div>
  );
}

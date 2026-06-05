import type { SectionGridProps } from "./types";

export function SectionGrid({ items }: SectionGridProps) {
  return (
    <div className="grid gap-1.5">
      {items.map((item, i) => (
        <div key={item.id ?? i} className="grid grid-cols-6 gap-1">
          {item.cells.map((cell, j) =>
            cell ? (
              <div
                key={j}
                className="rounded-md bg-emerald-50 px-1.5 py-1 text-center font-serif text-sm font-bold text-emerald-900"
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

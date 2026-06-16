import { cn } from "@/lib/utils";

import type { SectionContainerProps } from "./types";

export function SectionContainer({
  children,
  id,
  className,
  dark,
}: SectionContainerProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 px-6",
        dark ? "bg-background" : "bg-background",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

import { cn } from "@/lib/utils";

import type { EyebrowProps, HeadingProps, MutedProps } from "./types";

const headingSizes = {
  hero: "text-[clamp(44px,6vw,80px)] font-[800] leading-[1.04] tracking-[-0.04em]",
  section:
    "text-[clamp(30px,4vw,48px)] font-bold leading-[1.15] tracking-[-0.03em]",
  subsection: "text-[clamp(20px,2.5vw,26px)] font-bold leading-[1.3] tracking-[-0.02em]",
};

export function Heading({
  as: Tag = "h2",
  size = "section",
  children,
  className,
}: HeadingProps) {
  return (
    <Tag className={cn(headingSizes[size], className)}>{children}</Tag>
  );
}

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand-muted px-4 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-brand-light",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Muted({ children, size = "base", className }: MutedProps) {
  const sizes = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
  };

  return (
    <p
      className={cn(
        "leading-relaxed text-muted-foreground",
        sizes[size],
        className,
      )}
    >
      {children}
    </p>
  );
}

import type { ReactNode } from "react";

export interface HeadingProps {
  as?: "h1" | "h2" | "h3";
  size?: "hero" | "section" | "subsection";
  children: ReactNode;
  className?: string;
}

export interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

export interface MutedProps {
  children: ReactNode;
  size?: "sm" | "base" | "lg";
  className?: string;
}

export interface SectionContainerProps {
  children: ReactNode;
  id?: string;
  className?: string;
  dark?: boolean;
}

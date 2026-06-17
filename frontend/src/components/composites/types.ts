import type { ReactNode } from "react";

export interface BottomTabBarProps {
  className?: string;
}

export interface TabItem {
  id: string;
  href: string;
  icon: string;
  label: string;
}

export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  badge?: string;
  className?: string;
}

export interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

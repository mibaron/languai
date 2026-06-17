"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, BarChart2, Lightbulb, User } from "lucide-react";
import { cn } from "@/lib/utils";

import type { BottomTabBarProps } from "./types";

const tabs = [
  { id: "learn", href: "/learn", icon: BookOpen, label: "Learn" },
  { id: "explain", href: "/explain", icon: Lightbulb, label: "Explain" },
  { id: "practice", href: "/practice", icon: BarChart2, label: "Practice" },
  { id: "profile", href: "/profile", icon: User, label: "Profile" },
] as const;

export function BottomTabBar({ className }: BottomTabBarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex shrink-0 border-t border-border bg-background pb-[env(safe-area-inset-bottom,34px)]",
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.href);
        const Icon = tab.icon;

        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-[3px] py-[6px] transition-colors duration-150",
              isActive ? "text-brand" : "text-muted-foreground",
            )}
          >
            <Icon
              size={22}
              strokeWidth={isActive ? 2.25 : 1.75}
            />
            <span
              className={cn(
                "text-[10px] tracking-[0.01em]",
                isActive ? "font-bold" : "font-normal",
              )}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

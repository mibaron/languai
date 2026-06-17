"use client";

import { BookOpen } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Exam Prep", href: "#exam" },
  { label: "Pricing", href: "#pricing" },
];

export function LandingNavbar() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 h-16 border-b border-white/[0.08] bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-8 px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-[17px] font-bold tracking-tight text-foreground"
        >
          <div className="flex size-[30px] items-center justify-center rounded-lg bg-brand">
            <BookOpen className="size-4 text-white" />
          </div>
          Langu-AI
        </Link>

        <div className="hidden flex-1 items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2.5">
          <Button variant="ghost" size="sm" render={<Link href="/login" />}>
            Sign in
          </Button>
          <Button size="sm" className="bg-brand hover:bg-brand-hover" render={<Link href="/register" />}>
            Get started free <span className="ml-1">→</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}

import { BookOpen, Check, Medal, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

import type { AuthLayoutProps } from "./types";

const PERKS = [
  {
    icon: Sparkles,
    text: (
      <>
        <strong className="font-semibold text-zinc-300">AI-personalized</strong>{" "}
        examples & practice
      </>
    ),
  },
  {
    icon: Zap,
    text: (
      <>
        <strong className="font-semibold text-zinc-300">Gamified</strong>{" "}
        progress & streaks
      </>
    ),
  },
  {
    icon: Medal,
    text: (
      <>
        <strong className="font-semibold text-zinc-300">Official exam prep</strong>{" "}
        A1 – B2
      </>
    ),
  },
  {
    icon: Check,
    text: (
      <>
        <strong className="font-semibold text-zinc-300">Free forever</strong> —
        core content included
      </>
    ),
  },
];

function BrandPanel() {
  return (
    <div className="relative hidden w-[420px] shrink-0 flex-col overflow-hidden bg-background p-12 md:flex">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="pointer-events-none absolute -top-[120px] -left-[120px] size-[400px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.2)_0%,transparent_70%)]" />

      <Link
        href="/"
        className="relative z-10 flex items-center gap-2.5 text-lg font-bold tracking-tight text-foreground"
      >
        <div className="flex size-[34px] items-center justify-center rounded-[9px] bg-brand">
          <BookOpen className="size-[18px] text-white" />
        </div>
        Langu-AI
      </Link>

      <div className="relative z-10 flex flex-1 flex-col justify-center">
        <h1 className="mb-4 text-[34px] font-[800] leading-[1.1] tracking-[-0.04em] text-foreground">
          Learn German.
          <br />
          <span className="text-brand-light">Your way.</span>
        </h1>
        <p className="mb-9 text-[15px] leading-relaxed text-muted-foreground">
          AI-powered lessons, personalized to how you think — explained in your
          native language. Free forever.
        </p>

        <div className="flex flex-col gap-3">
          {PERKS.map((perk, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.06]">
                <perk.icon className="size-3.5 text-brand-light" />
              </div>
              <span className="text-[13px] text-zinc-400">{perk.text}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="relative z-10 text-xs text-zinc-700">© 2026 Langu-AI</p>
    </div>
  );
}

function MobileLogo() {
  return (
    <Link
      href="/"
      className="mb-8 flex items-center gap-2 text-[17px] font-bold tracking-tight md:hidden"
    >
      <div className="flex size-7 items-center justify-center rounded-[7px] bg-brand">
        <BookOpen className="size-3.5 text-white" />
      </div>
      Langu-AI
    </Link>
  );
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-muted/50">
      <BrandPanel />
      <div className="flex flex-1 items-center justify-center overflow-y-auto px-6 py-10">
        <div className="w-full max-w-[400px]">
          <MobileLogo />
          {children}
        </div>
      </div>
    </div>
  );
}

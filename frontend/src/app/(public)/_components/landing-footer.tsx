import { BookOpen } from "lucide-react";
import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Exam Prep", href: "#exam" },
  { label: "Pricing", href: "#pricing" },
  { label: "Sign in", href: "/login" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-background px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-[15px] font-bold tracking-tight text-foreground"
        >
          <div className="flex size-[30px] items-center justify-center rounded-lg bg-brand">
            <BookOpen className="size-4 text-white" />
          </div>
          Langu-AI
        </Link>

        <div className="flex gap-6">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <p className="text-xs text-zinc-600">
          © 2026 Langu-AI. Free German learning for everyone.
        </p>
      </div>
    </footer>
  );
}

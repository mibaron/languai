import { Check } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/kit/typography";

import { PhoneMockup } from "./phone-mockup";

function PulsingDot() {
  return (
    <span className="size-1.5 animate-pulse rounded-full bg-brand-light" />
  );
}

export function HeroSection() {
  return (
    <section className="flex min-h-screen items-center bg-background px-6 pt-36 pb-24">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div>
          <Eyebrow className="mb-6">
            <PulsingDot />
            AI-Powered · Free Forever
          </Eyebrow>

          <h1 className="mb-6 text-[clamp(44px,6vw,80px)] leading-[1.04] font-[800] tracking-[-0.04em] text-foreground">
            Your personal
            <br />
            German tutor.
            <br />
            <span className="text-brand-light">Powered by AI.</span>
          </h1>

          <p className="mb-9 max-w-[480px] text-[clamp(16px,1.8vw,19px)] leading-relaxed text-muted-foreground">
            Structured grammar lessons, vocabulary packs, and official exam prep
            — with AI that generates personalized exercises just for you. In
            your native language. Free forever.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="rounded-xl bg-brand px-6 py-3.5 text-[15px] font-semibold tracking-tight transition-all hover:-translate-y-px hover:bg-brand-hover"
              render={<Link href="/register" />}
            >
              Start learning free <span className="ml-1">→</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl border-white/[0.12] bg-transparent px-5 py-3.5 text-[15px] font-medium tracking-tight text-foreground hover:border-white/25 hover:bg-transparent"
              render={<a href="#how-it-works" />}
            >
              See how it works
            </Button>
          </div>

          <p className="mt-4 flex items-center gap-1.5 text-[13px] text-muted-foreground">
            <Check className="size-3.5 shrink-0" />
            No credit card. No subscription. Free forever.
          </p>
        </div>

        <PhoneMockup />
      </div>
    </section>
  );
}

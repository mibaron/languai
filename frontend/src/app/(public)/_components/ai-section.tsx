import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/kit/section-container";
import { Eyebrow } from "@/components/kit/typography";

import { AiDemoCard } from "./ai-demo-card";

const AI_FEATURES = [
  {
    text: (
      <>
        <strong className="text-foreground">Generate examples</strong> — any
        word or grammar rule, infinite variations
      </>
    ),
  },
  {
    text: (
      <>
        <strong className="text-foreground">Custom quizzes</strong> — AI builds
        a test from exactly what you&apos;ve been learning
      </>
    ),
  },
  {
    text: (
      <>
        <strong className="text-foreground">Native language explanations</strong>{" "}
        — ask anything, get answers you understand
      </>
    ),
  },
  {
    text: (
      <>
        <strong className="text-foreground">Adaptive difficulty</strong> — AI
        tracks your weak spots and drills them
      </>
    ),
  },
];

export function AiSection() {
  return (
    <SectionContainer id="how-it-works" className="bg-secondary py-24">
      <div className="mx-auto grid max-w-[1100px] items-center gap-16 lg:grid-cols-2">
        <div>
          <Eyebrow className="mb-5">
            <Sparkles className="size-3" />
            AI-Powered
          </Eyebrow>

          <h2 className="mb-4 text-[clamp(28px,3.5vw,44px)] font-bold leading-[1.15] tracking-tight text-foreground">
            Don&apos;t just memorize.
            <br />
            <span className="text-brand-light">Understand.</span>
          </h2>

          <p className="mb-8 text-base leading-relaxed text-muted-foreground">
            Langu-AI&apos;s AI doesn&apos;t replace learning — it accelerates it.
            Ask for a personalized explanation, generate practice sentences from
            any grammar rule, or create a custom quiz on the spot.
          </p>

          <div className="mb-9 flex flex-col gap-3.5">
            {AI_FEATURES.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex size-[22px] shrink-0 items-center justify-center rounded-full border border-brand/35 bg-brand/20">
                  <Check className="size-[11px] text-brand-light" />
                </div>
                <p className="text-sm leading-snug text-muted-foreground">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

          <Button
            size="lg"
            className="rounded-xl bg-brand px-6 py-3.5 text-[15px] font-semibold tracking-tight transition-all hover:-translate-y-px hover:bg-brand-hover"
            render={<Link href="/register" />}
          >
            Try it free <span className="ml-1">→</span>
          </Button>
        </div>

        <AiDemoCard />
      </div>
    </SectionContainer>
  );
}

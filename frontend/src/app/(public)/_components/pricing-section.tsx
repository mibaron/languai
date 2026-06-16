import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/kit/section-container";
import { Heading, Muted } from "@/components/kit/typography";

import type { TopUpPlan } from "./types";

const FREE_FEATURES = [
  "All grammar packs & tables",
  "Full vocabulary access",
  "Flashcards, quizzes & fill-in",
  "Exam prep A1 – B2",
  "Gamified progress & streaks",
];

const TOPUP_PLANS: TopUpPlan[] = [
  { credits: "500", price: "€2.49", perCredit: "≈ €0.005 per credit" },
  {
    credits: "1,500",
    price: "€5.99",
    perCredit: "≈ €0.004 per credit",
    popular: true,
  },
  { credits: "4,000", price: "€12.99", perCredit: "≈ €0.003 per credit" },
];

function FreePlanCard() {
  return (
    <div className="relative mb-8 overflow-hidden rounded-3xl bg-background p-10">
      <div className="pointer-events-none absolute -top-20 -right-20 size-[280px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.18)_0%,transparent_70%)]" />

      <div className="relative grid items-center gap-8 sm:grid-cols-[1fr_auto]">
        <div>
          <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-green-400">
            <span className="size-[5px] animate-pulse rounded-full bg-green-400" />
            Always free · No subscription
          </div>

          <h3 className="mb-2.5 text-[26px] font-[800] leading-tight tracking-tight text-foreground">
            Everything included.
            <br />
            From day one.
          </h3>

          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
            All grammar packs, vocabulary lists, verb tables, flashcards,
            quizzes, and exam prep — free forever. Plus 1,000 AI credits
            included on signup.
          </p>

          <div className="mb-7 grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2">
            {FREE_FEATURES.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-[13px] text-zinc-400"
              >
                <div className="flex size-4 shrink-0 items-center justify-center rounded-full border border-green-500/35 bg-green-500/20">
                  <Check className="size-[9px] text-green-400" />
                </div>
                {item}
              </div>
            ))}
            <div className="flex items-center gap-2 text-[13px] text-brand-light">
              <div className="flex size-4 shrink-0 items-center justify-center rounded-full border border-brand/40 bg-brand/25">
                <Check className="size-[9px] text-brand-light" />
              </div>
              <strong>1,000 AI credits</strong> — included free
            </div>
          </div>

          <Button
            variant="outline"
            className="rounded-xl border-white/15 bg-transparent px-5 py-3 text-sm font-semibold text-foreground transition-all hover:border-white/35 hover:bg-white/[0.05]"
            render={<Link href="/register" />}
          >
            Start for free — no signup needed
            <ArrowRight className="ml-2 size-3.5" />
          </Button>
        </div>

        <div className="shrink-0 text-center sm:text-right">
          <div className="text-[64px] font-[900] leading-none tracking-tighter text-foreground">
            €0
          </div>
          <div className="mt-1 text-[13px] font-medium text-zinc-600">
            forever
          </div>
        </div>
      </div>
    </div>
  );
}

function TopUpSection() {
  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Need more AI? Top up credits
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {TOPUP_PLANS.map((plan) => (
          <div
            key={plan.credits}
            className={`relative cursor-pointer rounded-2xl border-[1.5px] p-5 transition-all hover:border-brand hover:shadow-[0_4px_20px_rgba(37,99,235,0.1)] ${
              plan.popular ? "border-brand" : "border-border"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-brand px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-wide text-white">
                Best value
              </div>
            )}
            <div className="mb-0.5 text-[22px] font-[800] tracking-tight">
              {plan.credits}{" "}
              <span className="text-[13px] font-medium text-muted-foreground">
                credits
              </span>
            </div>
            <div className="mb-3 text-[13px] text-muted-foreground">
              <strong className="text-foreground">{plan.price}</strong> one-time
            </div>
            <div className="mb-3.5 text-[11px] text-muted-foreground">
              {plan.perCredit}
            </div>
            <Button
              size="sm"
              className="w-full rounded-lg bg-brand text-[13px] font-semibold hover:bg-brand-hover"
              render={<Link href="/register" />}
            >
              Top up
            </Button>
          </div>
        ))}
      </div>

      <p className="mt-3.5 text-center text-xs text-muted-foreground">
        Credits never expire · No auto-renewal · No subscription, ever
      </p>
    </>
  );
}

export function PricingSection() {
  return (
    <SectionContainer id="pricing" className="bg-card py-24">
      <div className="text-center">
        <span className="mb-3.5 block text-xs font-bold uppercase tracking-[0.1em] text-brand">
          Pricing
        </span>
        <Heading className="mb-3.5 text-card-foreground">
          One plan.
          <br />
          Always free.
        </Heading>
        <Muted className="mx-auto mb-14 max-w-[540px]">
          No subscriptions. No hidden tiers. Everything is free — including
          1,000 AI credits to get you started. Top up only if you need more.
        </Muted>
      </div>

      <div className="mx-auto max-w-[860px]">
        <FreePlanCard />
        <TopUpSection />
      </div>
    </SectionContainer>
  );
}

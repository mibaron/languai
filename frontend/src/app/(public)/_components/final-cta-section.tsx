import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/kit/section-container";

export function FinalCtaSection() {
  return (
    <SectionContainer className="bg-muted/50 py-24">
      <div className="text-center">
        <h2 className="mb-4 text-[clamp(30px,4vw,52px)] font-[800] leading-[1.1] tracking-[-0.04em]">
          Start speaking German.
          <br />
          Today. For free.
        </h2>

        <p className="mx-auto mb-9 max-w-[500px] text-[17px] leading-relaxed text-muted-foreground">
          Join thousands of learners building real German fluency with
          AI-powered, personalized content.
        </p>

        <Button
          size="lg"
          className="rounded-xl bg-brand px-6 py-3.5 text-[15px] font-semibold tracking-tight transition-all hover:-translate-y-px hover:bg-brand-hover"
          render={<Link href="/register" />}
        >
          Start learning — no sign-up needed <span className="ml-1">→</span>
        </Button>

        <p className="mt-3.5 text-[13px] text-muted-foreground">
          No sign-up required to start · Create an account anytime to save your
          progress
        </p>
      </div>
    </SectionContainer>
  );
}

import type { Metadata } from "next";

import { AiSection } from "./_components/ai-section";
import { ExamPrepSection } from "./_components/exam-prep-section";
import { FeaturesGrid } from "./_components/features-grid";
import { FinalCtaSection } from "./_components/final-cta-section";
import { HeroSection } from "./_components/hero-section";
import { HowItWorksSection } from "./_components/how-it-works-section";
import { LandingFooter } from "./_components/landing-footer";
import { LandingNavbar } from "./_components/landing-navbar";
import { PricingSection } from "./_components/pricing-section";
import { StatsBar } from "./_components/stats-bar";

export const metadata: Metadata = {
  title: "Langu-AI — AI-Powered German Learning",
  description:
    "Your personal German tutor powered by AI. Learn German from A1 to B2 with structured content, AI explanations, and exam preparation. Free forever.",
};

export default function LandingPage() {
  return (
    <>
      <LandingNavbar />
      <main>
        <HeroSection />
        <StatsBar />
        <FeaturesGrid />
        <AiSection />
        <HowItWorksSection />
        <ExamPrepSection />
        <PricingSection />
        <FinalCtaSection />
      </main>
      <LandingFooter />
    </>
  );
}

import {
  Globe,
  Grid2x2,
  Medal,
  Sparkles,
  Table2,
  Zap,
} from "lucide-react";

import { SectionContainer } from "@/components/kit/section-container";
import { Eyebrow, Heading, Muted } from "@/components/kit/typography";

import { FeatureCard } from "./feature-card";
import type { FeatureItem } from "./types";

const FEATURES: FeatureItem[] = [
  {
    icon: <Sparkles className="size-[22px] text-brand" />,
    iconBg: "oklch(0.932 0.032 262.881)",
    title: "AI-Generated Practice",
    description:
      "Generate custom examples, fill-in-the-blank exercises, and quizzes on demand — tailored to your current level and the exact topic you're studying.",
  },
  {
    icon: <Zap className="size-[22px] text-feature-yellow" />,
    iconBg: "oklch(0.981 0.038 93.115)",
    title: "Gamified Learning",
    description:
      "Daily streaks, achievement badges, and level-based progress tracking keep you motivated and coming back every day — without feeling like homework.",
  },
  {
    icon: <Grid2x2 className="size-[22px] text-success" />,
    iconBg: "oklch(0.962 0.044 156.743)",
    title: "Vocabulary Packs",
    description:
      "Curated word lists organized by level and topic. Flashcard review, spaced repetition, and AI-generated example sentences for every word.",
  },
  {
    icon: <Medal className="size-[22px] text-feature-purple" />,
    iconBg: "oklch(0.966 0.022 307.824)",
    title: "Official Exam Prep",
    description:
      "Content packs structured around Goethe-Institut and TELC exams from A1 to B2. Mock exams, timed practice, and AI feedback included.",
  },
  {
    icon: <Table2 className="size-[22px] text-feature-orange" />,
    iconBg: "oklch(0.977 0.025 36.259)",
    title: "Grammar Tables",
    description:
      "Complete conjugation and declension tables, clearly organized. Every rule backed by examples you can generate with one tap using AI.",
  },
  {
    icon: <Globe className="size-[22px] text-feature-cyan" />,
    iconBg: "oklch(0.963 0.023 232.838)",
    title: "Your Native Language",
    description:
      "All explanations available in English, Persian, Turkish, and Arabic. Learn German the way you naturally think — not through another foreign language.",
  },
];

export function FeaturesGrid() {
  return (
    <SectionContainer id="features" className="bg-card py-24">
      <div className="text-center">
        <Eyebrow className="mb-3.5 border-0 bg-transparent text-brand">
          Everything you need
        </Eyebrow>
        <Heading className="mb-3.5 text-card-foreground">
          One app. Every tool
          <br />
          you need to succeed.
        </Heading>
        <Muted className="mx-auto mb-14 max-w-[540px]">
          Grammar, vocabulary, gamified practice, and official exam prep — all
          in one place, all supported by AI.
        </Muted>
      </div>

      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </SectionContainer>
  );
}

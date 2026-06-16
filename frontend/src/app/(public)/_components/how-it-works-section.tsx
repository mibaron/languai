import { SectionContainer } from "@/components/kit/section-container";
import { Eyebrow, Heading, Muted } from "@/components/kit/typography";

const STEPS = [
  {
    number: 1,
    title: "Pick your pack",
    description:
      "Choose your CEFR level and native language. Each pack has grammar, vocabulary, verbs, and phrases — structured for your exam.",
  },
  {
    number: 2,
    title: "Learn & practice",
    description:
      "Study tables, review flashcards, take quizzes. Tap any item for AI-generated examples, explanations, or custom exercises.",
  },
  {
    number: 3,
    title: "Pass your exam",
    description:
      "Mock exams, timed practice, and AI feedback prepare you for Goethe-Institut and TELC certifications from A1 to B2.",
  },
];

export function HowItWorksSection() {
  return (
    <SectionContainer className="bg-muted/50 py-24">
      <div className="text-center">
        <Eyebrow className="mb-3.5 border-0 bg-transparent text-brand">
          How it works
        </Eyebrow>
        <Heading className="mb-3.5">Three steps to fluency.</Heading>
        <Muted className="mx-auto mb-14 max-w-[540px]">
          No complicated setup. No long onboarding. Just pick a pack and start
          learning.
        </Muted>
      </div>

      <div className="mx-auto grid max-w-[900px] grid-cols-1 gap-8 md:grid-cols-3">
        {STEPS.map((step) => (
          <div key={step.number} className="px-4 text-center">
            <div className="mx-auto mb-4 flex size-[52px] items-center justify-center rounded-full bg-brand text-xl font-[800] tracking-tight text-white">
              {step.number}
            </div>
            <div className="mb-2 text-[17px] font-semibold">{step.title}</div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}

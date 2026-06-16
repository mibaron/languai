import { Medal } from "lucide-react";

import { SectionContainer } from "@/components/kit/section-container";
import { Eyebrow } from "@/components/kit/typography";

import type { ExamCard } from "./types";

const EXAM_CARDS: ExamCard[] = [
  {
    level: "A1",
    levelBg: "rgba(34,197,94,0.15)",
    levelColor: "#4ade80",
    name: "Goethe-Zertifikat A1 — Start Deutsch",
    description: "Greetings, introductions, daily phrases",
    status: "available",
  },
  {
    level: "A2",
    levelBg: "rgba(59,130,246,0.15)",
    levelColor: "#60a5fa",
    name: "Goethe-Zertifikat A2",
    description: "Past tense, adjective declension, short texts",
    status: "available",
  },
  {
    level: "B1",
    levelBg: "rgba(168,85,247,0.15)",
    levelColor: "#c084fc",
    name: "Goethe-Zertifikat B1",
    description: "Complex sentences, subjunctive, longer writing",
    status: "coming-soon",
  },
  {
    level: "B2",
    levelBg: "rgba(251,146,60,0.15)",
    levelColor: "#fb923c",
    name: "Goethe-Zertifikat B2",
    description: "Fluency, argumentation, complex grammar",
    status: "coming-soon",
  },
];

const BADGES = ["Goethe-Institut", "TELC", "CEFR A1–B2", "Mock exams"];

export function ExamPrepSection() {
  return (
    <SectionContainer id="exam" className="bg-background py-24">
      <div className="mx-auto grid max-w-[1100px] items-center gap-16 lg:grid-cols-2">
        <div className="flex flex-col gap-3 lg:order-none order-last">
          {EXAM_CARDS.map((card) => (
            <div
              key={card.level}
              className="flex items-center gap-4 rounded-[14px] border border-white/[0.08] bg-white/[0.05] px-[18px] py-4"
            >
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-[10px] text-sm font-[800] tracking-tight"
                style={{
                  background: card.levelBg,
                  color: card.levelColor,
                }}
              >
                {card.level}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-foreground">
                  {card.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {card.description}
                </div>
              </div>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={
                  card.status === "available"
                    ? {
                        background: card.levelBg,
                        color: card.levelColor,
                      }
                    : {
                        background: "rgba(255,255,255,0.08)",
                        color: "#52525b",
                      }
                }
              >
                {card.status === "available" ? "Available" : "Coming soon"}
              </span>
            </div>
          ))}
        </div>

        <div>
          <Eyebrow className="mb-5">
            <Medal className="size-3" />
            Exam Prep
          </Eyebrow>

          <h2 className="mb-4 text-[clamp(28px,3.5vw,44px)] font-bold leading-[1.15] tracking-tight text-foreground">
            Ready for your
            <br />
            official exam?
          </h2>

          <p className="mb-7 text-base leading-relaxed text-muted-foreground">
            LinguAI&apos;s content packs are structured around CEFR levels and
            aligned with Goethe-Institut and TELC exam requirements. Practice
            until you&apos;re confident — with timed mock exams and AI feedback.
          </p>

          <div className="flex flex-wrap gap-2">
            {BADGES.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-white/[0.12] px-3.5 py-1.5 text-[13px] font-medium text-muted-foreground"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}

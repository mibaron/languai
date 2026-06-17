"use client";

import { Zap, FileText, Award, Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const modes = [
  {
    id: "flash",
    icon: Zap,
    title: "Flashcards",
    desc: "Review vocabulary at your own pace",
    meta: "180 cards",
    bg: "bg-yellow-100/80 dark:bg-yellow-500/15",
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
  {
    id: "fill",
    icon: FileText,
    title: "Fill in the Blanks",
    desc: "Complete sentences in context",
    meta: "48 exercises",
    bg: "bg-blue-50 dark:bg-blue-500/15",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "quiz",
    icon: Award,
    title: "Quiz",
    desc: "Multiple-choice knowledge test",
    meta: "60 questions",
    bg: "bg-green-50 dark:bg-green-500/15",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    id: "exam",
    icon: Clock,
    title: "Mock Exam",
    desc: "Timed A1 exam simulation",
    meta: "30 minutes",
    bg: "bg-purple-50 dark:bg-purple-500/15",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
] as const;

export default function PracticePage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 pb-2 pt-4">
        <div className="mb-0.5 text-lg font-bold tracking-[-0.02em] text-foreground">
          Practice
        </div>
        <div className="text-[13px] text-muted-foreground">
          German A1.1 &middot; English
        </div>
      </div>
      <div className="flex flex-col gap-2.5 px-4 pb-4 pt-2">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              className="flex w-full items-center gap-3.5 rounded-[14px] border border-border bg-card p-4 text-left"
            >
              <div
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-[13px]",
                  mode.bg,
                )}
              >
                <Icon size={22} className={mode.iconColor} />
              </div>
              <div className="flex-1">
                <div className="mb-0.5 text-[15px] font-semibold text-foreground">
                  {mode.title}
                </div>
                <div className="mb-[3px] text-[13px] text-muted-foreground">
                  {mode.desc}
                </div>
                <div className="text-[11px] font-medium text-muted-foreground/70">
                  {mode.meta}
                </div>
              </div>
              <ChevronRight size={18} className="text-muted-foreground/40" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

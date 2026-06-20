"use client";

import { useRouter } from "next/navigation";
import { Zap, FileText, Award, ArrowUpDown, AlertTriangle, Link2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const modes = [
  {
    id: "flashcard",
    icon: Zap,
    title: "Flashcards",
    desc: "Review vocabulary at your own pace",
    bg: "bg-yellow-100/80 dark:bg-yellow-500/15",
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
  {
    id: "mcq_recognition",
    icon: Award,
    title: "Quiz",
    desc: "Multiple-choice knowledge test",
    bg: "bg-green-50 dark:bg-green-500/15",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    id: "fill_blank",
    icon: FileText,
    title: "Fill in the Blanks",
    desc: "Complete sentences in context",
    bg: "bg-blue-50 dark:bg-blue-500/15",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "sentence_order",
    icon: ArrowUpDown,
    title: "Sentence Order",
    desc: "Arrange words into correct sentences",
    bg: "bg-purple-50 dark:bg-purple-500/15",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "error_correction",
    icon: AlertTriangle,
    title: "Error Correction",
    desc: "Find and fix mistakes in sentences",
    bg: "bg-orange-50 dark:bg-orange-500/15",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    id: "matching",
    icon: Link2,
    title: "Matching",
    desc: "Match words with their translations",
    bg: "bg-teal-50 dark:bg-teal-500/15",
    iconColor: "text-teal-600 dark:text-teal-400",
  },
] as const;

export function PracticeTabContent() {
  const router = useRouter();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 pb-2 pt-4">
        <div className="mb-0.5 text-lg font-bold tracking-[-0.02em] text-foreground">
          Practice
        </div>
        <div className="text-[13px] text-muted-foreground">
          Choose a mode to start practicing
        </div>
      </div>
      <div className="flex flex-col gap-2.5 px-4 pb-4 pt-2">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              onClick={() => router.push(`/practice/session?mode=${mode.id}`)}
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
                <div className="text-[13px] text-muted-foreground">
                  {mode.desc}
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

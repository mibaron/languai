"use client";

import { useRouter } from "next/navigation";
import { Zap, FileText, Award, Clock, ChevronRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const modes = [
  {
    id: "flashcard",
    icon: Zap,
    title: "Flashcards",
    desc: "Review vocabulary at your own pace",
    bg: "bg-yellow-100/80 dark:bg-yellow-500/15",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    enabled: true,
  },
  {
    id: "mcq_recognition",
    icon: Award,
    title: "Quiz",
    desc: "Multiple-choice knowledge test",
    bg: "bg-green-50 dark:bg-green-500/15",
    iconColor: "text-green-600 dark:text-green-400",
    enabled: true,
  },
  {
    id: "fill",
    icon: FileText,
    title: "Fill in the Blanks",
    desc: "Complete sentences in context",
    bg: "bg-blue-50 dark:bg-blue-500/15",
    iconColor: "text-blue-600 dark:text-blue-400",
    enabled: false,
  },
  {
    id: "exam",
    icon: Clock,
    title: "Mock Exam",
    desc: "Timed A1 exam simulation",
    bg: "bg-purple-50 dark:bg-purple-500/15",
    iconColor: "text-purple-600 dark:text-purple-400",
    enabled: false,
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
              disabled={!mode.enabled}
              onClick={
                mode.enabled
                  ? () => router.push(`/practice/session?mode=${mode.id}`)
                  : undefined
              }
              className={cn(
                "flex w-full items-center gap-3.5 rounded-[14px] border border-border bg-card p-4 text-left",
                !mode.enabled && "opacity-50",
              )}
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
              {mode.enabled ? (
                <ChevronRight size={18} className="text-muted-foreground/40" />
              ) : (
                <Lock size={16} className="text-muted-foreground/30" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { Coffee } from "lucide-react";
import { EmptyState } from "@/components/composites/empty-state";

interface SessionEmptyProps {
  onExit: () => void;
}

export function SessionEmpty({ onExit }: SessionEmptyProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <EmptyState
        icon={<Coffee size={28} className="text-brand" />}
        title="Nothing to review"
        description="You're all caught up! Check back later or add new packs to keep learning."
      />
      <button
        type="button"
        onClick={onExit}
        className="mt-6 rounded-xl bg-brand px-8 py-3 text-sm font-semibold text-white active:scale-[0.98]"
      >
        Go back
      </button>
    </div>
  );
}

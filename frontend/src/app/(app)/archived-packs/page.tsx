"use client";

import { ArrowLeft, Archive } from "lucide-react";
import { useRouter } from "next/navigation";

import { EmptyState } from "@/components/composites/empty-state";

export default function ArchivedPacksPage() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex h-[52px] shrink-0 items-center gap-2.5 border-b border-border/50 px-4">
        <button
          onClick={() => router.back()}
          className="flex size-9 items-center justify-center rounded-full text-foreground"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-base font-semibold tracking-[-0.01em] text-foreground">
          Archived Packs
        </span>
      </div>
      <EmptyState
        icon={<Archive size={22} className="text-brand" />}
        title="Archived Packs"
        description="Packs you archive will appear here."
        badge="Coming soon"
      />
    </div>
  );
}

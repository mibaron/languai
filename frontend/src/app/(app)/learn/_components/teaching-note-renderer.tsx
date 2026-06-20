import type { TeachingNoteDetail } from "@/lib/api/orval/api/generated/model";

interface TeachingNoteRendererProps {
  detail: TeachingNoteDetail;
}

export function TeachingNoteRenderer({ detail }: TeachingNoteRendererProps) {
  return (
    <div className="rounded-lg bg-muted/50 p-4">
      <div className="whitespace-pre-line text-sm leading-relaxed text-foreground">
        {detail.content}
      </div>
    </div>
  );
}

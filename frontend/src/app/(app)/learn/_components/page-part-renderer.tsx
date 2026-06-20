import type {
  ConversationDetail,
  FillBlankDetail,
  PagePart,
  TableDetail,
  TeachingNoteDetail,
} from "@/lib/api/orval/api/generated/model";
import { PartTypeEnum } from "@/lib/api/orval/api/generated/model";

import { ConversationRenderer } from "./conversation-renderer";
import { FillBlankRenderer } from "./fill-blank-renderer";
import { TableRenderer } from "./table-renderer";
import { TeachingNoteRenderer } from "./teaching-note-renderer";

interface PagePartRendererProps {
  part: PagePart;
  onFillBlankComplete?: (partId: string) => void;
}

export function PagePartRenderer({ part, onFillBlankComplete }: PagePartRendererProps) {
  if (!part.detail) return null;

  switch (part.part_type) {
    case PartTypeEnum.note:
      return <TeachingNoteRenderer detail={part.detail as TeachingNoteDetail} />;
    case PartTypeEnum.fill_blank:
      return (
        <FillBlankRenderer
          detail={part.detail as FillBlankDetail}
          onComplete={() => onFillBlankComplete?.(part.id)}
        />
      );
    case PartTypeEnum.conversation:
      return <ConversationRenderer detail={part.detail as ConversationDetail} />;
    case PartTypeEnum.table:
      return <TableRenderer detail={part.detail as TableDetail} />;
    default:
      return null;
  }
}

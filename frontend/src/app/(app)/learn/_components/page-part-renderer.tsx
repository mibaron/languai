import type {
  ConversationDetail,
  FillBlankDetail,
  PagePart,
  TeachingNoteDetail,
} from "@/lib/api/orval/api/generated/model";
import { PartTypeEnum } from "@/lib/api/orval/api/generated/model";

import { ConversationRenderer } from "./conversation-renderer";
import { FillBlankRenderer } from "./fill-blank-renderer";
import { TeachingNoteRenderer } from "./teaching-note-renderer";

interface PagePartRendererProps {
  part: PagePart;
}

export function PagePartRenderer({ part }: PagePartRendererProps) {
  if (!part.detail) return null;

  switch (part.part_type) {
    case PartTypeEnum.note:
      return <TeachingNoteRenderer detail={part.detail as TeachingNoteDetail} />;
    case PartTypeEnum.fill_blank:
      return <FillBlankRenderer detail={part.detail as FillBlankDetail} />;
    case PartTypeEnum.conversation:
      return <ConversationRenderer detail={part.detail as ConversationDetail} />;
    default:
      return null;
  }
}

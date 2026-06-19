import { NoteBox } from "./note-box";
import { SectionGrid } from "./section-grid";
import { SectionNotes } from "./section-notes";
import { SectionTable } from "./section-table";
import type { SectionCardProps } from "./types";

export function SectionCard({
  section,
  levelCode,
  category,
  explainMode,
  onExplainItem,
}: SectionCardProps) {
  return (
    <>
      {section.note && <NoteBox text={section.note} variant="warning" />}
      {section.note2 && <NoteBox text={section.note2} variant="info" />}
      {section.type === "table" && section.headers && (
        <SectionTable
          headers={section.headers}
          items={section.items}
          sectionTitle={section.title}
          levelCode={levelCode}
          category={category}
          explainMode={explainMode}
          onExplainItem={onExplainItem}
        />
      )}
      {section.type === "grid" && (
        <SectionGrid
          items={section.items}
          sectionTitle={section.title}
          levelCode={levelCode}
          category={category}
          explainMode={explainMode}
          onExplainItem={onExplainItem}
        />
      )}
      {section.type === "notes" && (
        <SectionNotes
          items={section.items}
          sectionTitle={section.title}
          levelCode={levelCode}
          category={category}
          explainMode={explainMode}
          onExplainItem={onExplainItem}
        />
      )}
    </>
  );
}

import type { Section } from "@/types/content";

export function filterSections(sections: Section[], query: string): Section[] {
  const term = query.trim().toLowerCase();
  if (!term) return sections;

  return sections.filter(
    (s) =>
      s.title.toLowerCase().includes(term) ||
      s.rows?.some((row) => row.some((cell) => cell.toLowerCase().includes(term))) ||
      s.notes?.some((note) => note.toLowerCase().includes(term)),
  );
}

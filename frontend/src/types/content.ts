export type LevelCode = "A1.1" | "A1.2" | "A2.1" | "A2.2";

export type CategoryId = "grammar" | "vocab" | "verbs" | "phrases";

export type SectionContentType = "table" | "notes" | "grid";

export interface SectionItem {
  id?: string;
  order: number;
  cells: string[];
}

export interface Section {
  id?: string;
  title: string;
  type: SectionContentType;
  note?: string;
  note2?: string;
  headers?: string[];
  items: SectionItem[];
}

export type LevelContent = Record<CategoryId, Section[]>;

export type BooksData = Record<LevelCode, LevelContent>;

export interface CategoryTab {
  id: CategoryId;
  label: string;
  icon: string;
}

import type { CategoryId, LevelCode, Section } from "@/types/content";

export interface LevelSwitcherProps {
  currentLevel: LevelCode;
  onLevelChange: (level: LevelCode) => void;
}

export interface CategoryTabsProps {
  currentCategory: CategoryId;
  onCategoryChange: (category: CategoryId) => void;
}

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export interface PageHeaderProps {
  currentLevel: LevelCode;
  currentCategory: CategoryId;
  onLevelChange: (level: LevelCode) => void;
  onCategoryChange: (category: CategoryId) => void;
}

export interface SectionCardProps {
  section: Section;
}

export interface SectionTableProps {
  headers: string[];
  rows: string[][];
}

export interface SectionGridProps {
  rows: string[][];
}

export interface SectionNotesProps {
  notes: string[];
}

export interface NoteBoxProps {
  text: string;
  variant?: "warning" | "info";
}

export interface SectionListProps {
  sections: Section[];
}

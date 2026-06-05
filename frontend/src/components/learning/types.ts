import type { CategoryId, LevelCode, Section, SectionItem } from "@/types/content";

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
  items: SectionItem[];
}

export interface SectionGridProps {
  items: SectionItem[];
}

export interface SectionNotesProps {
  items: SectionItem[];
}

export interface NoteBoxProps {
  text: string;
  variant?: "warning" | "info";
}

export interface SectionListProps {
  sections: Section[];
}

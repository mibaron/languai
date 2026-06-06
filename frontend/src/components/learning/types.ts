import type { CategoryId, LevelCode, Section, SectionItem } from "@/types/content";
import type { SearchMatch, SearchResults } from "@/types/search";

export interface LevelSwitcherProps {
  currentLevel: LevelCode;
  onLevelChange: (level: LevelCode) => void;
}

export interface CategoryTabsProps {
  currentCategory: CategoryId;
  onCategoryChange: (category: CategoryId) => void;
}

export interface NavbarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export interface ContentPanelProps {
  currentLevel: LevelCode;
  currentCategory: CategoryId;
  onLevelChange: (level: LevelCode) => void;
  onCategoryChange: (category: CategoryId) => void;
}

export interface SectionContextProps {
  levelCode: string;
  category: string;
}

export interface SectionCardProps extends SectionContextProps {
  section: Section;
}

export interface SectionTableProps extends SectionContextProps {
  sectionTitle: string;
  headers: string[];
  items: SectionItem[];
}

export interface SectionGridProps extends SectionContextProps {
  sectionTitle: string;
  items: SectionItem[];
}

export interface SectionNotesProps extends SectionContextProps {
  sectionTitle: string;
  items: SectionItem[];
}

export interface NoteBoxProps {
  text: string;
  variant?: "warning" | "info";
}

export interface SectionListProps extends SectionContextProps {
  sections: Section[];
  storageKey: string;
}

export interface HighlightTextProps {
  text: string;
  query: string;
}

export interface SearchResultCardProps {
  match: SearchMatch;
  query: string;
}

export interface SearchResultsPanelProps {
  results: SearchResults;
  onClear: () => void;
}

export interface SearchFilterBarProps {
  results: SearchResults;
  selectedLevel: LevelCode | null;
  selectedCategory: CategoryId | null;
  onLevelChange: (level: LevelCode | null) => void;
  onCategoryChange: (category: CategoryId | null) => void;
}

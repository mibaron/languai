import type { CategoryId, LevelCode, Section, SectionItem } from "./content";

export interface SearchMatch {
  section: Section;
  levelCode: LevelCode;
  category: CategoryId;
  matchingItems: SectionItem[];
  titleMatch: boolean;
  totalMatches: number;
}

export interface SearchResults {
  query: string;
  matches: SearchMatch[];
  totalMatches: number;
}

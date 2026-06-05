import { BOOKS } from "@/data/books";
import { LEVEL_CODES } from "@/data/tabs";
import type { CategoryId, LevelCode } from "@/types/content";
import type { SearchMatch, SearchResults } from "@/types/search";

const ALL_CATEGORIES: CategoryId[] = ["grammar", "vocab", "verbs", "phrases"];

export function searchAllContent(query: string): SearchResults {
  const term = query.trim().toLowerCase();
  if (!term) {
    return { query, matches: [], totalMatches: 0 };
  }

  const matches: SearchMatch[] = [];
  let totalMatches = 0;

  for (const levelCode of LEVEL_CODES) {
    const level = BOOKS[levelCode as LevelCode];
    for (const category of ALL_CATEGORIES) {
      const sections = level[category];
      for (const section of sections) {
        const titleMatch = section.title.toLowerCase().includes(term);
        const matchingItems = section.items.filter((item) =>
          item.cells.some((cell) => cell.toLowerCase().includes(term)),
        );

        if (titleMatch || matchingItems.length > 0) {
          const itemMatchCount = matchingItems.reduce(
            (count, item) =>
              count + item.cells.filter((c) => c.toLowerCase().includes(term)).length,
            0,
          );
          const sectionTotal = (titleMatch ? 1 : 0) + itemMatchCount;
          totalMatches += sectionTotal;

          matches.push({
            section,
            levelCode: levelCode as LevelCode,
            category,
            matchingItems,
            titleMatch,
            totalMatches: sectionTotal,
          });
        }
      }
    }
  }

  matches.sort((a, b) => b.totalMatches - a.totalMatches);

  return { query, matches, totalMatches };
}

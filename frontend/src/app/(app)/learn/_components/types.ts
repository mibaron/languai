import type { Pack, UserPackSubscription } from "@/lib/api/orval/api/generated/model";
import type { CategoryId, Section } from "@/types/content";

export interface PackHeaderProps {
  activePack: Pack | null;
  overallProgress: number;
  onOpenPackDrawer: () => void;
  onOpenStats: () => void;
}

export interface CategoryTabsProps {
  activeCategory: CategoryId;
  onCategoryChange: (category: CategoryId) => void;
}

export interface SectionCardProps {
  section: Section;
  onOpen: (section: Section) => void;
}

export interface SectionListProps {
  sections: Section[];
  onOpenSection: (section: Section) => void;
}

export interface PackSelectorDrawerProps {
  packs: UserPackSubscription[];
  activePackId: string | null;
  onSelect: (packId: string) => void;
  onClose: () => void;
}

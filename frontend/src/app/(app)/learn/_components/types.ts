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

export interface PackStatsDrawerProps {
  pack: Pack;
  open: boolean;
  onClose: () => void;
}

export interface SectionDetailHeaderProps {
  title: string;
  sectionIndex: number;
  totalSections: number;
  onBack: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export interface SectionDetailViewProps {
  section: Section;
  sectionIndex: number;
  totalSections: number;
  levelCode: string;
  category: string;
  onBack: () => void;
  onNavigate: (index: number) => void;
}

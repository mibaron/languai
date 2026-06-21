import type { Pack, PageDetail, PageList, SectionList, UserPackSubscription } from "@/lib/api/orval/api/generated/model";
import type { CategoryId } from "@/types/content";

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
  section: SectionList;
  onOpen: (section: SectionList) => void;
}

export interface SectionListProps {
  sections: SectionList[];
  onOpenSection: (section: SectionList) => void;
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
  sectionId: string;
  sectionIndex: number;
  totalSections: number;
  levelCode: string;
  category: string;
  onBack: () => void;
  onNavigate: (index: number) => void;
}

export interface PageCardProps {
  page: PageList;
  onOpen: (page: PageList) => void;
}

export interface PageListViewProps {
  pages: PageList[];
  onOpenPage: (page: PageList) => void;
}

export interface PageDetailViewProps {
  page: PageDetail;
  pageIndex: number;
  totalPages: number;
  levelCode: string;
  onBack: () => void;
  onNavigate: (index: number) => void;
  onMarkStudied: () => void;
  isMarkingStudied: boolean;
}

export interface PageDetailHeaderProps {
  title: string;
  pageIndex: number;
  totalPages: number;
  isStudied: boolean;
  onBack: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

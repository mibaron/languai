import type { Pack, UserPackSubscription } from "@/lib/api/orval/api/generated/model";

export interface ExplorePacksViewProps {
  open: boolean;
  subscribedPackIds: string[];
  onSubscribe: (packId: string) => void;
  onClose: () => void;
}

export interface PackActionSheetProps {
  subscription: UserPackSubscription | null;
  onClose: () => void;
  onArchive: (packId: string) => void;
  onUnsubscribe: (packId: string) => void;
}

export interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}

export interface ProfileRowProps {
  icon: React.ComponentType<{ size: number; className?: string }>;
  label: string;
  value?: string;
  last?: boolean;
  onClick?: () => void;
  action?: React.ReactNode;
}

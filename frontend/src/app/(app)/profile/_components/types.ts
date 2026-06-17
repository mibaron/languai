import type { UserPackSubscription } from "@/lib/api/orval/api/generated/model";

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

export interface EditNameDrawerProps {
  open: boolean;
  firstName: string;
  lastName: string;
  onSave: (firstName: string, lastName: string) => void;
  onClose: () => void;
  isSaving: boolean;
}

export interface LanguageDrawerProps {
  open: boolean;
  mode: "speaks" | "learning";
  currentValue: string;
  onSave: (value: string) => void;
  onClose: () => void;
  isSaving: boolean;
}

export interface ChangePasswordDrawerProps {
  open: boolean;
  onClose: () => void;
}

export interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

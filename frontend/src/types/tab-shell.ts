export type TabId = "learn" | "explain" | "practice" | "profile";

export interface TabShellContextValue {
  activeTab: TabId;
  switchTab: (tab: TabId) => void;
  isSubRoute: boolean;
}

export const TAB_PATHS: Record<TabId, string> = {
  learn: "/learn",
  explain: "/explain",
  practice: "/practice",
  profile: "/profile",
};

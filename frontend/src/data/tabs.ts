import type { CategoryTab } from "@/types/content";

export const CATEGORY_TABS: CategoryTab[] = [
  { id: "grammar", label: "Grammatik", icon: "⚙" },
  { id: "vocab", label: "Wortschatz", icon: "📖" },
  { id: "verbs", label: "Verben", icon: "🔄" },
  { id: "phrases", label: "Phrasen", icon: "💬" },
] as const;

export const LEVEL_CODES = ["A1.1", "A1.2", "A2.1", "A2.2"] as const;

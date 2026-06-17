"use client";

import { useCallback, useMemo, useState } from "react";

import { usePacksSubscriptionsList } from "@/lib/api/orval/api/generated/packs/packs";
import { BOOKS } from "@/data/books";
import type { CategoryId, LevelCode, Section } from "@/types/content";

export function useLearnTab() {
  const [category, setCategory] = useState<CategoryId>("grammar");
  const [activePackId, setActivePackId] = useState<string | null>(null);
  const [packDrawerOpen, setPackDrawerOpen] = useState(false);
  const [statsDrawerOpen, setStatsDrawerOpen] = useState(false);

  const { data: subscriptions, isLoading } = usePacksSubscriptionsList({
    status: "active",
  });

  const activePack = useMemo(() => {
    if (!subscriptions || subscriptions.length === 0) return null;
    if (activePackId) {
      const found = subscriptions.find((s) => s.pack.id === activePackId);
      if (found) return found.pack;
    }
    return subscriptions[0].pack;
  }, [subscriptions, activePackId]);

  const levelCode = activePack?.level_code as LevelCode | undefined;

  const sections: Section[] = useMemo(() => {
    if (!levelCode || !BOOKS[levelCode]) return [];
    return BOOKS[levelCode][category] ?? [];
  }, [levelCode, category]);

  const selectPack = useCallback((packId: string) => {
    setActivePackId(packId);
    setPackDrawerOpen(false);
    setCategory("grammar");
  }, []);

  const openPackDrawer = useCallback(() => setPackDrawerOpen(true), []);
  const closePackDrawer = useCallback(() => setPackDrawerOpen(false), []);
  const openStats = useCallback(() => setStatsDrawerOpen(true), []);
  const closeStats = useCallback(() => setStatsDrawerOpen(false), []);

  return {
    category,
    setCategory,
    activePack,
    activePackId: activePack?.id ?? null,
    subscriptions: subscriptions ?? [],
    isLoading,
    sections,
    packDrawerOpen,
    statsDrawerOpen,
    selectPack,
    openPackDrawer,
    closePackDrawer,
    openStats,
    closeStats,
  };
}

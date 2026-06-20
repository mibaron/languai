"use client";

import { useCallback, useMemo, useState } from "react";

import { usePacksSubscriptionsList } from "@/lib/api/orval/api/generated/packs/packs";
import { BOOKS } from "@/data/books";
import type { CategoryId, LevelCode, Section } from "@/types/content";

import { useLearnPages } from "./use-learn-pages";

export function useLearnTab() {
  const [category, setCategory] = useState<CategoryId>("grammar");
  const [activePackId, setActivePackId] = useState<string | null>(null);
  const [packDrawerOpen, setPackDrawerOpen] = useState(false);
  const [statsDrawerOpen, setStatsDrawerOpen] = useState(false);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<
    number | null
  >(null);

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

  const selectedSection = useMemo(
    () =>
      selectedSectionIndex !== null ? (sections[selectedSectionIndex] ?? null) : null,
    [sections, selectedSectionIndex],
  );

  const learnPages = useLearnPages(activePack?.id ?? null);

  const selectPack = useCallback((packId: string) => {
    setActivePackId(packId);
    setPackDrawerOpen(false);
    setCategory("grammar");
    setSelectedSectionIndex(null);
    learnPages.resetPages();
  }, [learnPages]);

  const changeCategory = useCallback((cat: CategoryId) => {
    setCategory(cat);
    setSelectedSectionIndex(null);
  }, []);

  const openSection = useCallback(
    (section: Section) => {
      const idx = sections.indexOf(section);
      if (idx !== -1) setSelectedSectionIndex(idx);
    },
    [sections],
  );

  const closeSection = useCallback(() => setSelectedSectionIndex(null), []);

  const navigateSection = useCallback(
    (index: number) => {
      if (index >= 0 && index < sections.length) {
        setSelectedSectionIndex(index);
      }
    },
    [sections.length],
  );

  const openPackDrawer = useCallback(() => setPackDrawerOpen(true), []);
  const closePackDrawer = useCallback(() => setPackDrawerOpen(false), []);
  const openStats = useCallback(() => setStatsDrawerOpen(true), []);
  const closeStats = useCallback(() => setStatsDrawerOpen(false), []);

  return {
    category,
    setCategory: changeCategory,
    activePack,
    activePackId: activePack?.id ?? null,
    subscriptions: subscriptions ?? [],
    isLoading,
    sections,
    selectedSection,
    selectedSectionIndex,
    openSection,
    closeSection,
    navigateSection,
    packDrawerOpen,
    statsDrawerOpen,
    selectPack,
    openPackDrawer,
    closePackDrawer,
    openStats,
    closeStats,
    learnPages,
  };
}

"use client";

import { useCallback, useMemo, useState } from "react";

import type { SectionList } from "@/lib/api/orval/api/generated/model";
import { usePacksSubscriptionsList } from "@/lib/api/orval/api/generated/packs/packs";
import { getSectionsListQueryKey, useSectionsList } from "@/lib/api/orval/api/generated/sections/sections";
import type { CategoryId } from "@/types/content";

import { useLearnPages } from "./use-learn-pages";

export function useLearnTab() {
  const [category, setCategory] = useState<CategoryId>("grammar");
  const [activePackId, setActivePackId] = useState<string | null>(null);
  const [packDrawerOpen, setPackDrawerOpen] = useState(false);
  const [statsDrawerOpen, setStatsDrawerOpen] = useState(false);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<
    number | null
  >(null);

  const { data: subscriptions, isLoading: isLoadingPacks } = usePacksSubscriptionsList({
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

  const levelCode = activePack?.level_code;

  const sectionsParams = { level__code: levelCode, category, ordering: "order" };
  const { data: sectionsData, isLoading: isLoadingSections } = useSectionsList(
    sectionsParams,
    { query: { queryKey: getSectionsListQueryKey(sectionsParams), enabled: !!levelCode } },
  );

  const sections: SectionList[] = sectionsData?.results ?? [];

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
    (section: SectionList) => {
      const idx = sections.findIndex((s) => s.id === section.id);
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
    isLoading: isLoadingPacks || isLoadingSections,
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

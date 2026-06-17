"use client";

import { Package } from "lucide-react";

import { EmptyState } from "@/components/composites/empty-state";

import { CategoryTabs } from "./_components/category-tabs";
import { PackHeader } from "./_components/pack-header";
import { PackSelectorDrawer } from "./_components/pack-selector-drawer";
import { SectionList } from "./_components/section-list";
import { useLearnTab } from "./_hooks/use-learn-tab";

export default function LearnPage() {
  const {
    category,
    setCategory,
    activePack,
    activePackId,
    subscriptions,
    isLoading,
    sections,
    packDrawerOpen,
    selectPack,
    openPackDrawer,
    closePackDrawer,
    openStats,
  } = useLearnTab();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!activePack) {
    return (
      <EmptyState
        icon={<Package size={26} className="text-brand" />}
        title="No packs subscribed"
        description="Browse packs from the Profile tab to get started."
      />
    );
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <PackHeader
        activePack={activePack}
        overallProgress={0}
        onOpenPackDrawer={openPackDrawer}
        onOpenStats={openStats}
      />
      <CategoryTabs
        activeCategory={category}
        onCategoryChange={setCategory}
      />
      <SectionList sections={sections} onOpenSection={() => {}} />

      {packDrawerOpen && (
        <PackSelectorDrawer
          packs={subscriptions}
          activePackId={activePackId}
          onSelect={selectPack}
          onClose={closePackDrawer}
        />
      )}
    </div>
  );
}

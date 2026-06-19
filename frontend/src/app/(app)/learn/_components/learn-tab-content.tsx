"use client";

import { Package } from "lucide-react";

import { EmptyState } from "@/components/composites/empty-state";

import { CategoryTabs } from "./category-tabs";
import { PackHeader } from "./pack-header";
import { PackSelectorDrawer } from "./pack-selector-drawer";
import { PackStatsDrawer } from "./pack-stats-drawer";
import { SectionDetailView } from "./section-detail-view";
import { SectionList } from "./section-list";
import { useLearnTab } from "../_hooks/use-learn-tab";

export function LearnTabContent() {
  const {
    category,
    setCategory,
    activePack,
    activePackId,
    subscriptions,
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

      {selectedSection && selectedSectionIndex !== null ? (
        <SectionDetailView
          section={selectedSection}
          sectionIndex={selectedSectionIndex}
          totalSections={sections.length}
          levelCode={activePack.level_code}
          category={category}
          onBack={closeSection}
          onNavigate={navigateSection}
        />
      ) : (
        <>
          <CategoryTabs
            activeCategory={category}
            onCategoryChange={setCategory}
          />
          <SectionList sections={sections} onOpenSection={openSection} />
        </>
      )}

      {packDrawerOpen && (
        <PackSelectorDrawer
          packs={subscriptions}
          activePackId={activePackId}
          onSelect={selectPack}
          onClose={closePackDrawer}
        />
      )}

      {activePack && (
        <PackStatsDrawer
          pack={activePack}
          open={statsDrawerOpen}
          onClose={closeStats}
        />
      )}
    </div>
  );
}

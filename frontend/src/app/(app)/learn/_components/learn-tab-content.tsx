"use client";

import { Package } from "lucide-react";

import { EmptyState } from "@/components/composites/empty-state";

import { CategoryTabs } from "./category-tabs";
import { PackHeader } from "./pack-header";
import { PackSelectorDrawer } from "./pack-selector-drawer";
import { PackStatsDrawer } from "./pack-stats-drawer";
import { PageDetailView } from "./page-detail-view";
import { PageListView } from "./page-list-view";
import { SectionDetailView } from "./section-detail-view";
import { SectionList } from "./section-list";
import { useLearnTab } from "../_hooks/use-learn-tab";
import { usePackProgress } from "../_hooks/use-pack-progress";

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
    learnPages,
  } = useLearnTab();

  const packProgress = usePackProgress(activePack?.id ?? null);

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

  const showPages = learnPages.hasPages;

  const renderContent = () => {
    if (showPages) {
      if (learnPages.pageDetail && learnPages.selectedPageIndex !== null) {
        return (
          <PageDetailView
            page={learnPages.pageDetail}
            pageIndex={learnPages.selectedPageIndex}
            totalPages={learnPages.pages.length}
            levelCode={activePack.level_code}
            onBack={learnPages.closePage}
            onNavigate={learnPages.navigatePage}
            onMarkStudied={learnPages.handleMarkStudied}
            isMarkingStudied={learnPages.isMarkingStudied}
          />
        );
      }

      if (learnPages.selectedPage && learnPages.isDetailLoading) {
        return (
          <div className="flex flex-1 items-center justify-center">
            <div className="size-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          </div>
        );
      }

      return <PageListView pages={learnPages.pages} onOpenPage={learnPages.openPage} />;
    }

    if (selectedSection && selectedSectionIndex !== null) {
      return (
        <SectionDetailView
          sectionId={selectedSection.id}
          sectionIndex={selectedSectionIndex}
          totalSections={sections.length}
          levelCode={activePack.level_code}
          category={category}
          onBack={closeSection}
          onNavigate={navigateSection}
        />
      );
    }

    return (
      <>
        <CategoryTabs
          activeCategory={category}
          onCategoryChange={setCategory}
        />
        <SectionList sections={sections} onOpenSection={openSection} />
      </>
    );
  };

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <PackHeader
        activePack={activePack}
        overallProgress={packProgress.overallPercent}
        onOpenPackDrawer={openPackDrawer}
        onOpenStats={openStats}
      />

      {renderContent()}

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
          totalPages={packProgress.totalPages}
          studiedPages={packProgress.studiedPages}
          overallPercent={packProgress.overallPercent}
          categories={packProgress.categories}
        />
      )}
    </div>
  );
}

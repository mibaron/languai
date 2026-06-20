"use client";

import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  getPacksPagesListQueryKey,
  getPacksPagesRetrieveQueryKey,
  usePacksPagesList,
  usePacksPagesRetrieve,
} from "@/lib/api/orval/api/generated/pages/pages";
import { useProgressPagesMarkStudiedCreate } from "@/lib/api/orval/api/generated/progress/progress";
import type { PageList } from "@/lib/api/orval/api/generated/model";

export function useLearnPages(packId: string | null) {
  const [selectedPageIndex, setSelectedPageIndex] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const {
    data: pagesData,
    isLoading: isPagesLoading,
  } = usePacksPagesList(packId ?? "", undefined, {
    query: {
      queryKey: getPacksPagesListQueryKey(packId ?? ""),
      enabled: !!packId,
    },
  });

  const pages = useMemo(
    () => pagesData?.results ?? [],
    [pagesData],
  );

  const hasPages = pages.length > 0;

  const selectedPage = useMemo(
    () => (selectedPageIndex !== null ? pages[selectedPageIndex] ?? null : null),
    [pages, selectedPageIndex],
  );

  const {
    data: pageDetail,
    isLoading: isDetailLoading,
  } = usePacksPagesRetrieve(
    packId ?? "",
    selectedPage?.id ?? "",
    {
      query: {
        queryKey: getPacksPagesRetrieveQueryKey(packId ?? "", selectedPage?.id ?? ""),
        enabled: !!packId && !!selectedPage,
      },
    },
  );

  const markStudied = useProgressPagesMarkStudiedCreate();

  const openPage = useCallback(
    (page: PageList) => {
      const idx = pages.findIndex((p) => p.id === page.id);
      if (idx !== -1) setSelectedPageIndex(idx);
    },
    [pages],
  );

  const closePage = useCallback(() => setSelectedPageIndex(null), []);

  const navigatePage = useCallback(
    (index: number) => {
      if (index >= 0 && index < pages.length) {
        setSelectedPageIndex(index);
      }
    },
    [pages.length],
  );

  const handleMarkStudied = useCallback(() => {
    if (!selectedPage || !packId) return;
    markStudied.mutate(
      { pageId: selectedPage.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getPacksPagesListQueryKey(packId),
          });
        },
      },
    );
  }, [selectedPage, packId, markStudied, queryClient]);

  const resetPages = useCallback(() => {
    setSelectedPageIndex(null);
  }, []);

  return {
    pages,
    hasPages,
    isPagesLoading,
    selectedPage,
    selectedPageIndex,
    pageDetail,
    isDetailLoading,
    openPage,
    closePage,
    navigatePage,
    handleMarkStudied,
    isMarkingStudied: markStudied.isPending,
    resetPages,
  };
}

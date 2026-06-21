"use client";

import { useMemo } from "react";

import {
  getProgressPacksRetrieveQueryKey,
  useProgressPacksRetrieve,
} from "@/lib/api/orval/api/generated/progress/progress";

const CATEGORY_LABELS: Record<string, string> = {
  grammar_rule: "Grammar",
  vocab: "Vocabulary",
  verb: "Verbs",
  phrase: "Phrases",
};

const CATEGORY_ORDER = ["grammar_rule", "vocab", "verb", "phrase"];

export interface CategoryStat {
  key: string;
  label: string;
  total: number;
  studied: number;
  percent: number;
}

export function usePackProgress(packId: string | null) {
  const { data, isLoading } = useProgressPacksRetrieve(packId ?? "", {
    query: {
      queryKey: getProgressPacksRetrieveQueryKey(packId ?? ""),
      enabled: !!packId,
    },
  });

  const overallPercent = useMemo(() => {
    if (!data || data.total_pages === 0) return 0;
    return Math.round((data.studied_pages / data.total_pages) * 100);
  }, [data]);

  const categories = useMemo((): CategoryStat[] => {
    if (!data?.categories) return [];
    return CATEGORY_ORDER
      .filter((key) => data.categories[key])
      .map((key) => {
        const cat = data.categories[key];
        return {
          key,
          label: CATEGORY_LABELS[key] ?? key,
          total: cat.total,
          studied: cat.studied,
          percent: cat.total > 0 ? Math.round((cat.studied / cat.total) * 100) : 0,
        };
      });
  }, [data]);

  return {
    totalPages: data?.total_pages ?? 0,
    studiedPages: data?.studied_pages ?? 0,
    overallPercent,
    categories,
    isLoading,
  };
}

export { getProgressPacksRetrieveQueryKey };

"use client";

import { useCallback, useState } from "react";

function readFromStorage(key: string): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeToStorage(key: string, values: number[]) {
  try {
    localStorage.setItem(key, JSON.stringify(values));
  } catch {
    /* quota exceeded — ignore */
  }
}

export function usePersistedSet(storageKey: string, totalCount: number) {
  const [openIndices, setOpenIndices] = useState<number[]>(() => {
    const stored = readFromStorage(storageKey);
    return stored.length > 0 ? stored : Array.from({ length: totalCount }, (_, i) => i);
  });

  const setAndPersist = useCallback(
    (indices: number[]) => {
      setOpenIndices(indices);
      writeToStorage(storageKey, indices);
    },
    [storageKey],
  );

  const expandAll = useCallback(() => {
    setAndPersist(Array.from({ length: totalCount }, (_, i) => i));
  }, [totalCount, setAndPersist]);

  const collapseAll = useCallback(() => {
    setAndPersist([]);
  }, [setAndPersist]);

  const allExpanded = openIndices.length === totalCount;

  return { openIndices, setOpenIndices: setAndPersist, expandAll, collapseAll, allExpanded };
}

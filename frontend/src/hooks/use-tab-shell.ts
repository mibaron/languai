"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import type { TabId, TabShellContextValue } from "@/types/tab-shell";
import { TAB_PATHS } from "@/types/tab-shell";

const TAB_IDS = Object.keys(TAB_PATHS) as TabId[];

function tabFromPathname(pathname: string): TabId | null {
  for (const id of TAB_IDS) {
    if (pathname === TAB_PATHS[id] || pathname === TAB_PATHS[id] + "/") {
      return id;
    }
  }
  return null;
}

function parentTabFromPathname(pathname: string): TabId | null {
  for (const id of TAB_IDS) {
    if (pathname.startsWith(TAB_PATHS[id])) {
      return id;
    }
  }
  return null;
}

export function useTabShell(): TabShellContextValue {
  const pathname = usePathname();
  const initialTab = tabFromPathname(pathname) ?? parentTabFromPathname(pathname) ?? "learn";

  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  const isSubRoute = useMemo(() => {
    return tabFromPathname(pathname) === null;
  }, [pathname]);

  const switchTab = useCallback((tab: TabId) => {
    setActiveTab(tab);
    window.history.replaceState(null, "", TAB_PATHS[tab]);
  }, []);

  useEffect(() => {
    const tab = tabFromPathname(pathname);
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [pathname]);

  return { activeTab, switchTab, isSubRoute };
}

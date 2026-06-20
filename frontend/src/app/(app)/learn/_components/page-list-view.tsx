import { PageCard } from "./page-card";
import type { PageListViewProps } from "./types";

export function PageListView({ pages, onOpenPage }: PageListViewProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {pages.map((page) => (
        <PageCard key={page.id} page={page} onOpen={onOpenPage} />
      ))}
    </div>
  );
}

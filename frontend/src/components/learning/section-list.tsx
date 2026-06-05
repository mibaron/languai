"use client";

import { ChevronsDownUp, ChevronsUpDown, FileQuestion } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePersistedSet } from "@/hooks/use-persisted-set";

import { SectionCard } from "./section-card";
import type { SectionListProps } from "./types";

export function SectionList({ sections, storageKey }: SectionListProps) {
  const { openIndices, setOpenIndices, expandAll, collapseAll, allExpanded } =
    usePersistedSet(storageKey, sections.length);

  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <FileQuestion className="mb-3 h-10 w-10 opacity-40" />
        <p className="text-sm">No matching sections found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={allExpanded ? collapseAll : expandAll}
          className="gap-1.5 text-xs text-muted-foreground mt-8"
        >
          {allExpanded ? (
            <>
              <ChevronsDownUp className="h-3.5 w-3.5" /> Collapse all
            </>
          ) : (
            <>
              <ChevronsUpDown className="h-3.5 w-3.5" /> Expand all
            </>
          )}
        </Button>
      </div>

      <Card>
        <Accordion value={openIndices} onValueChange={setOpenIndices}>
          {sections.map((section, i) => (
            <AccordionItem key={i} value={i}>
              <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
                {section.title}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <SectionCard section={section} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
}

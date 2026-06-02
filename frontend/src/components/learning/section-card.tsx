"use client";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

import { NoteBox } from "./note-box";
import { SectionGrid } from "./section-grid";
import { SectionNotes } from "./section-notes";
import { SectionTable } from "./section-table";
import type { SectionCardProps } from "./types";

export function SectionCard({ section }: SectionCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className="mb-4 overflow-hidden border-stone-300 shadow-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger
          className={cn(
            "flex w-full items-center justify-between px-4 py-2.5 font-serif text-sm font-bold tracking-tight transition-colors",
            isOpen
              ? "bg-emerald-900 text-emerald-100"
              : "bg-stone-100 text-emerald-900",
          )}
        >
          <span>{section.title}</span>
          <span className="text-xs opacity-60">{isOpen ? "▲" : "▼"}</span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="p-4">
            {section.note && <NoteBox text={section.note} variant="warning" />}
            {section.note2 && <NoteBox text={section.note2} variant="info" />}
            {section.type === "table" && section.headers && section.rows && (
              <SectionTable headers={section.headers} rows={section.rows} />
            )}
            {section.type === "grid" && section.rows && (
              <SectionGrid rows={section.rows} />
            )}
            {section.type === "notes" && section.notes && (
              <SectionNotes notes={section.notes} />
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

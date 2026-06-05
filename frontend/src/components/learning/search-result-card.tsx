"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { HighlightText } from "./highlight-text";
import type { SearchResultCardProps } from "./types";

const CATEGORY_LABELS: Record<string, string> = {
  grammar: "Grammatik",
  vocab: "Wortschatz",
  verbs: "Verben",
  phrases: "Phrasen",
};

export function SearchResultCard({ match, query }: SearchResultCardProps) {
  const { section, levelCode, category, matchingItems, titleMatch, totalMatches } = match;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold leading-snug">
              {titleMatch ? (
                <HighlightText text={section.title} query={query} />
              ) : (
                section.title
              )}
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Badge variant="outline" className="text-xs">
              {levelCode}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {CATEGORY_LABELS[category] ?? category}
            </Badge>
            <Badge className="bg-yellow-500/20 text-xs text-yellow-300 hover:bg-yellow-500/20">
              {totalMatches} {totalMatches === 1 ? "match" : "matches"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      {matchingItems.length > 0 && (
        <CardContent className="pt-0">
          {section.type === "table" && section.headers ? (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    {section.headers.map((h, i) => (
                      <TableHead key={i} className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider">
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matchingItems.map((item, i) => (
                    <TableRow key={item.id ?? i}>
                      {item.cells.map((cell, j) => (
                        <TableCell key={j} className={j === 0 ? "font-medium" : "text-muted-foreground"}>
                          <HighlightText text={cell} query={query} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="space-y-0 divide-y rounded-md border">
              {matchingItems.map((item, i) => (
                <div key={item.id ?? i} className="px-3 py-2 text-sm text-muted-foreground">
                  <HighlightText text={item.cells[0] ?? ""} query={query} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

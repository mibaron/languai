import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { SectionTableProps } from "./types";

export function SectionTable({
  headers,
  items,
  sectionTitle,
  levelCode,
  category,
  explainMode,
  onExplainItem,
}: SectionTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {headers.map((header, i) => (
              <TableHead
                key={i}
                className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, i) => (
            <TableRow
              key={item.id ?? i}
              onClick={
                explainMode
                  ? () =>
                      onExplainItem?.({
                        levelCode,
                        category,
                        sectionTitle,
                        sectionHeaders: headers,
                        itemOrder: item.order ?? i,
                        itemCells: item.cells,
                      })
                  : undefined
              }
              className={cn(
                explainMode &&
                  "cursor-pointer ring-1 ring-brand/30 bg-brand/5 hover:bg-brand/10",
              )}
            >
              {item.cells.map((cell, j) => (
                <TableCell
                  key={j}
                  className={j === 0 ? "font-medium" : "text-muted-foreground"}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

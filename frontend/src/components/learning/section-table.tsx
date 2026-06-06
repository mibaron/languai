import { AIButton } from "@/components/ai/ai-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { SectionTableProps } from "./types";

export function SectionTable({ headers, items, sectionTitle, levelCode, category }: SectionTableProps) {
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
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, i) => (
            <TableRow key={item.id ?? i}>
              {item.cells.map((cell, j) => (
                <TableCell
                  key={j}
                  className={j === 0 ? "font-medium" : "text-muted-foreground"}
                >
                  {cell}
                </TableCell>
              ))}
              <TableCell className="w-10 px-1">
                <AIButton
                  context={{
                    levelCode,
                    category,
                    sectionTitle,
                    sectionHeaders: headers,
                    itemOrder: item.order ?? i,
                    itemCells: item.cells,
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

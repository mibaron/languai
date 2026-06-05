import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { SectionTableProps } from "./types";

export function SectionTable({ headers, items }: SectionTableProps) {
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
            <TableRow key={item.id ?? i}>
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

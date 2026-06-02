import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { SectionTableProps } from "./types";

export function SectionTable({ headers, rows }: SectionTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-emerald-900">
            {headers.map((header, i) => (
              <TableHead
                key={i}
                className="whitespace-nowrap font-serif text-xs uppercase tracking-wider text-emerald-900"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i} className={i % 2 === 0 ? "bg-stone-50" : "bg-white"}>
              {row.map((cell, j) => (
                <TableCell
                  key={j}
                  className={
                    j === 0
                      ? "font-serif text-sm font-bold text-emerald-950"
                      : "text-sm text-emerald-800"
                  }
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

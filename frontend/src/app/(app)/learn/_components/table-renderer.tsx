import type { TableDetail } from "@/lib/api/orval/api/generated/model";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Muted } from "@/components/kit/typography";

interface TableRendererProps {
  detail: TableDetail;
}

export function TableRenderer({ detail }: TableRendererProps) {
  return (
    <div className="space-y-2">
      {detail.note && <Muted>{detail.note}</Muted>}
      <Table>
        {detail.headers.length > 0 && (
          <TableHeader>
            <TableRow>
              {detail.headers.map((header, i) => (
                <TableHead key={i}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {detail.rows.map((row, rowIdx) => (
            <TableRow key={rowIdx}>
              {row.map((cell, cellIdx) => (
                <TableCell key={cellIdx}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { AIExamplesViewProps } from "./types";

export function AIExamplesView({ data }: AIExamplesViewProps) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-xs font-semibold uppercase tracking-wider">
              Deutsch
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider">
              English
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.examples.map((example, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{example.german}</TableCell>
              <TableCell className="text-muted-foreground">{example.english}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

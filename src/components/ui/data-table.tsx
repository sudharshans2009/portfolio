"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type DataTableColumn<T> = {
  header: string;
  cell: (row: T) => React.ReactNode;
  searchable?: (row: T) => string;
};

export default function DataTable<T>({
  data,
  columns,
  emptyMessage,
  placeholder = "Filter results…",
}: {
  data: T[];
  columns: DataTableColumn<T>[];
  emptyMessage: string;
  placeholder?: string;
}) {
  const [filter, setFilter] = useState("");
  const filteredData = useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) return data;
    return data.filter((row) =>
      columns.some((column) =>
        column.searchable?.(row).toLowerCase().includes(query),
      ),
    );
  }, [columns, data, filter]);

  return (
    <div className="grid gap-3">
      <div className="relative max-w-sm">
        <Search
          className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder={placeholder}
          className="pl-9"
          style={{ paddingLeft: "2.25rem" }}
          aria-label={placeholder}
        />
      </div>
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.header}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.header}>
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// src/components/data-table.tsx
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Assuming shadcn Table components

interface DataTableProps<TData, TValue extends React.ReactNode> {
  columns: {
    header: string | React.ReactNode;
    accessorKey?: string; // Optional if header is just a string and value is direct
    cell: (row: TData) => TValue | React.ReactNode;
  }[];
  data: TData[];
  isLoading?: boolean;
  noDataMessage?: string;
}

export function DataTable<TData, TValue extends React.ReactNode>({
  columns,
  data,
  isLoading,
  noDataMessage = "No data found.",
}: DataTableProps<TData, TValue>) {
  if (isLoading) {
    return <p className="p-3 text-center text-muted-foreground">Loading data...</p>;
  }

  if (!data || data.length === 0) {
    return <p className="p-3 text-center text-muted-foreground">{noDataMessage}</p>;
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index}>
                {typeof column.header === 'string' ? column.header : column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row: TData, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
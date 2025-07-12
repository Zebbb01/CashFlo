// src/components/ui/data-table.tsx
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<TData, TValue extends React.ReactNode> {
  columns: {
    header: string | React.ReactNode;
    accessorKey?: string;
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
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="rounded-lg border fade-in">
        <div className="p-6 space-y-4">
          <div className="flex space-x-4">
            {columns.map((_, index) => (
              <Skeleton key={index} className="h-4 flex-1" />
            ))}
          </div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex space-x-4">
              {columns.map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border fade-in">
        <div className="p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-muted-foreground text-lg font-medium">{noDataMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-sm border overflow-hidden transition-all duration-300 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    }`}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index} className="transition-opacity duration-300 bg-primary">
                {typeof column.header === 'string' ? (
                  <span className="font-semibold text-primary-foreground">{column.header}</span>
                ) : (
                  column.header
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row: TData, rowIndex) => (
            <TableRow
              key={rowIndex}
              className="hover:bg-muted/40 transition-colors duration-200"
            >
              {columns.map((column, colIndex) => (
                <TableCell
                  key={colIndex}
                  className="transition-colors duration-150 hover:text-primary"
                >
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

// src/components/financial-management/revenue-section.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Revenue } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface RevenueSectionProps {
  revenues: Revenue[];
  isLoadingRevenues: boolean;
  onAddRevenue: () => void;
  onEditRevenue: (revenue: Revenue) => void;
  onViewRevenue: (revenue: Revenue) => void;
  onDeleteRevenue: (revenueId: string) => void;
}

export function RevenueSection({
  revenues,
  isLoadingRevenues,
  onAddRevenue,
  onEditRevenue,
  onViewRevenue,
  onDeleteRevenue,
}: RevenueSectionProps) {
  const revenueColumns = [
    {
      header: "Source",
      accessorKey: "source",
      cell: (row: Revenue) => row.source,
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (row: Revenue) => `₱${row.amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      header: "Date",
      accessorKey: "date",
      cell: (row: Revenue) => new Date(row.date).toLocaleDateString(),
    },
    {
      header: "Recorded By",
      accessorKey: "user.name",
      cell: (row: Revenue) => row.user?.name || row.user?.email || "N/A",
    },
    {
      header: "Bank Asset",
      accessorKey: "bankAssetManagement.assetName",
      cell: (row: Revenue) => row.bankAssetManagement?.assetName || "N/A",
    },
    {
      header: "Actions",
      cell: (row: Revenue) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewRevenue(row)}>View</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditRevenue(row)}>Edit</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDeleteRevenue(row.id)}
              className="text-red-600 focus:text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button onClick={onAddRevenue}>Add New Revenue</Button>
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-2">Revenue Entries</h3>
      <DataTable
        columns={revenueColumns}
        data={revenues}
        isLoading={isLoadingRevenues}
        noDataMessage="No revenue entries found. Add your first revenue above!"
      />
    </>
  );
}
// src/components/financial-management/cost-section.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Cost } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface CostSectionProps {
  costs: Cost[];
  isLoadingCosts: boolean;
  onAddCost: () => void;
  onEditCost: (cost: Cost) => void;
  onViewCost: (cost: Cost) => void;
  onDeleteCost: (costId: string) => void;
}

export function CostSection({
  costs,
  isLoadingCosts,
  onAddCost,
  onEditCost,
  onViewCost,
  onDeleteCost,
}: CostSectionProps) {
  const costColumns = [
    {
      header: "Category",
      accessorKey: "category",
      cell: (row: Cost) => row.category,
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (row: Cost) => (
        <span className="text-red-500">
          -₱{row.amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: "Date",
      accessorKey: "date",
      cell: (row: Cost) => new Date(row.date).toLocaleDateString(),
    },
    {
      header: "Incurred By",
      accessorKey: "user.name",
      cell: (row: Cost) => row.user?.name || row.user?.email || "N/A",
    },
    {
      header: "Bank Asset",
      accessorKey: "bankAssetManagement.assetName",
      cell: (row: Cost) => row.bankAssetManagement?.assetName || "N/A",
    },
    {
      header: "Actions",
      cell: (row: Cost) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewCost(row)}>View</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditCost(row)}>Edit</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDeleteCost(row.id)}
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
      <div className="flex flex-col sm:flex-row gap-4 mb-8 space-y-2 mt-6">
        <Button onClick={onAddCost}>Add New Cost</Button>
      </div>

      <h3 className="text-lg font-semibold mt-8 mb-2">Cost Entries</h3>
      <DataTable
        columns={costColumns}
        data={costs}
        isLoading={isLoadingCosts}
        noDataMessage="No cost entries found. Add your first cost above!"
      />
    </>
  );
}
'use client';

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Bank } from "@/types";

interface BankTableSectionProps {
  banks: Bank[];
  isLoadingBanks: boolean;
}

export function BankTableSection({ banks, isLoadingBanks }: BankTableSectionProps) {
  const bankColumns = [
    {
      header: "Bank Name",
      accessorKey: "name",
      cell: (bank: Bank) => bank.name,
    },
    {
      header: "Overall Savings",
      accessorKey: "overallSavings",
      cell: (bank: Bank) => (
        <span>₱{bank.overallSavings?.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</span>
      ),
    },
  ];

  return (
    <>
      <h3 className="text-lg font-semibold mt-4 mb-2">Banks Overview</h3>
      <DataTable
        columns={bankColumns}
        data={banks || []}
        isLoading={isLoadingBanks}
        noDataMessage="No banks found. Add your first bank above!"
      />
    </>
  );
}

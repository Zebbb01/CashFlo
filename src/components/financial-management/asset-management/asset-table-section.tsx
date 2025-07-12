'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Asset, Company, Bank, User } from "@/types"; // Ensure all types are imported

interface AssetTableSectionProps {
  assets: Asset[];
  isLoadingAssets: boolean;
  isLoadingCompanies: boolean;
  isLoadingBanks: boolean;
  isLoadingUsers: boolean;
  handleEditAsset: (asset: Asset) => void;
  handleViewAsset: (asset: Asset) => void;
  handleManageColleagues: (asset: Asset) => void;
  handleToggleSoftDelete: (asset: Asset) => Promise<void>;
  handleDeleteClick: (assetId: string) => void;
  updateAssetMutationIsPending: boolean;
}

export function AssetTableSection({
  assets,
  isLoadingAssets,
  isLoadingCompanies,
  isLoadingBanks,
  isLoadingUsers,
  handleEditAsset,
  handleViewAsset,
  handleManageColleagues,
  handleToggleSoftDelete,
  handleDeleteClick,
  updateAssetMutationIsPending,
}: AssetTableSectionProps) {
  const assetColumns = [
    {
      header: "Asset Name",
      accessorKey: "assetName",
      cell: (asset: Asset) => asset.assetName,
    },
    {
      header: "Type",
      accessorKey: "assetType",
      cell: (asset: Asset) => asset.assetType,
    },
    {
      header: "Company",
      accessorKey: "company.name",
      cell: (asset: Asset) => asset.company?.name || "N/A",
    },
    {
      header: "Bank",
      accessorKey: "bank.name",
      cell: (asset: Asset) => asset.bank?.name || "N/A",
    },
    {
      header: "Owner",
      accessorKey: "owner.name",
      cell: (asset: Asset) => asset.owner?.name || asset.owner?.email || "N/A",
    },
    {
      header: "Expected Total Value",
      accessorKey: "assetValue",
      cell: (asset: Asset) => (
        <span>₱{asset.assetValue?.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0"}</span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (asset: Asset) => (
        asset.deletedAt ? (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Soft-Deleted</span>
        ) : (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
        )
      ),
    },
    {
      header: "Actions",
      cell: (asset: Asset) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleViewAsset(asset)}>View</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditAsset(asset)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleManageColleagues(asset)}>Manage Colleagues</DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => handleToggleSoftDelete(asset)} disabled={updateAssetMutationIsPending}>
              {asset.deletedAt ? "Restore" : "Soft Delete"}
            </DropdownMenuItem> */}
            <DropdownMenuItem onClick={() => handleDeleteClick(asset.id)} className="text-red-600 focus:text-red-600">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <h3 className="text-lg font-semibold mt-6 mb-2">Current Assets</h3>
      <DataTable
        columns={assetColumns}
        data={assets || []}
        isLoading={isLoadingAssets || isLoadingBanks || isLoadingCompanies || isLoadingUsers}
        noDataMessage="No assets found. Add your first asset above!"
      />
    </>
  );
}

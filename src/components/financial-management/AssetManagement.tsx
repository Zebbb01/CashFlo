// src/components/financial-management/AssetManagement.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  useAssets,
  useDeleteAsset,
  useUpdateAsset,
} from "@/hooks/financial-management/useAssets";
import { useCompanies } from "@/hooks/financial-management/useCompanies";
import { Asset } from "@/types";

// Import the new modal components and DataTable
import { AddCompanyModal } from "./modals/AssetManagement/AddCompanyModal";
import { AddAssetModal } from "./modals/AssetManagement/AddAssetModal";
import { EditAssetModal } from "./modals/AssetManagement/EditAssetModal";
import { ViewAssetModal } from "./modals/AssetManagement/ViewAssetModal";
import { DataTable } from "@/components/data-table"; // Adjust path if needed

// Import AlertDialog components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function AssetManagement() {
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isEditAssetModalOpen, setIsEditAssetModalOpen] = useState(false);
  const [isViewAssetModalOpen, setIsViewAssetModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null); // For edit/view modals

  // State for the delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [assetToDeleteId, setAssetToDeleteId] = useState<string | null>(null);

  const { data: assets, isLoading: isLoadingAssets, error: assetsError } = useAssets();
  const { error: companiesError } = useCompanies();

  const updateAssetMutation = useUpdateAsset();
  const deleteAssetMutation = useDeleteAsset();

  useEffect(() => {
    if (assetsError) {
      toast.error("Error fetching assets", {
        description: assetsError.message,
      });
    }
    if (companiesError) {
      toast.error("Error fetching companies", {
        description: companiesError.message,
      });
    }
  }, [assetsError, companiesError]);

  const handleToggleSoftDelete = async (asset: Asset) => {
    try {
      await updateAssetMutation.mutateAsync({
        id: asset.id,
        payload: { softDelete: asset.deletedAt === null ? true : false },
      });
      toast.info("Asset Status Updated", {
        description: `Asset "${asset.assetName}" ${
          asset.deletedAt === null ? "soft-deleted" : "restored"
        }.`,
      });
    } catch (error: any) {
      toast.error("Failed to update asset status", {
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  // Function to initiate the delete process by opening the dialog
  const handleDeleteClick = (assetId: string) => {
    setAssetToDeleteId(assetId);
    setIsDeleteDialogOpen(true);
  };

  // Function to handle the actual hard delete after confirmation
  const handleConfirmDelete = async () => {
    if (!assetToDeleteId) return;

    try {
      await deleteAssetMutation.mutateAsync(assetToDeleteId);
      toast.success("Asset Deleted", {
        description: "The asset has been permanently deleted.",
      });
      setIsDeleteDialogOpen(false); // Close the dialog on success
      setAssetToDeleteId(null); // Clear the ID
    } catch (error: any) {
      toast.error("Failed to delete asset", {
        description: error.message || "An unexpected error occurred.",
      });
      setIsDeleteDialogOpen(false); // Close the dialog even on error
      setAssetToDeleteId(null); // Clear the ID
    }
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsEditAssetModalOpen(true);
  };

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsViewAssetModalOpen(true);
  };

  // Define columns for the DataTable
  const assetColumns = [
    {
      header: "Asset Name",
      accessorKey: "assetName",
      // Corrected cell function: it receives the `Asset` object directly
      cell: (asset: Asset) => asset.assetName,
    },
    {
      header: "Type",
      accessorKey: "assetType",
      // Corrected cell function
      cell: (asset: Asset) => asset.assetType,
    },
    {
      header: "Company",
      accessorKey: "company.name",
      // Corrected cell function
      cell: (asset: Asset) => asset.company?.name || "N/A",
    },
    {
      header: "Value",
      accessorKey: "assetValue",
      // Corrected cell function
      cell: (asset: Asset) => (
        <span>₱{asset.assetValue.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      // Corrected cell function
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
      // Corrected cell function: it receives the `Asset` object directly
      cell: (asset: Asset) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleViewAsset(asset)}>
            View
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleEditAsset(asset)}>
            Edit
          </Button>
          {/* <Button
            variant="outline"
            size="sm"
            onClick={() => handleToggleSoftDelete(asset)}
            disabled={updateAssetMutation.isPending}
          >
            {asset.deletedAt ? "Restore" : "Soft Delete"}
          </Button> */}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteClick(asset.id)} // Use the new handler here
            disabled={deleteAssetMutation.isPending}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Management</CardTitle>
        <CardDescription>Add and track your assets and associated companies.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button onClick={() => setIsCompanyModalOpen(true)}>Add New Company</Button>
          <Button onClick={() => setIsAssetModalOpen(true)}>Add New Asset</Button>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">Current Assets</h3>
        <DataTable
          columns={assetColumns}
          data={assets || []}
          isLoading={isLoadingAssets}
          noDataMessage="No assets found. Add your first asset above!"
        />
      </CardContent>

      {/* Modals */}
      <AddCompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
      />
      <AddAssetModal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
      />
      <EditAssetModal
        isOpen={isEditAssetModalOpen}
        onClose={() => setIsEditAssetModalOpen(false)}
        asset={selectedAsset}
      />
      <ViewAssetModal
        isOpen={isViewAssetModalOpen}
        onClose={() => setIsViewAssetModalOpen(false)}
        asset={selectedAsset}
      />

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your asset and remove its
              data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
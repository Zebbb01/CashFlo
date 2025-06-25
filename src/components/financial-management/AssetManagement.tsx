// src/components/financial-management/AssetManagement.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  useAssets,
  useCreateAsset,
  useDeleteAsset,
  useUpdateAsset,
} from "@/hooks/useAssets";
import { useCompanies } from "@/hooks/useCompanies";
import { Asset } from "@/types";

export function AssetManagement() {
  const [newAssetType, setNewAssetType] = useState("");
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetValue, setNewAssetValue] = useState<string>("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");

  const { data: assets, isLoading: isLoadingAssets, error: assetsError } = useAssets();
  const { data: companies, isLoading: isLoadingCompanies, error: companiesError } = useCompanies();

  const createAssetMutation = useCreateAsset();
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

  const handleAddAsset = async () => {
    if (!newAssetType || !newAssetName || !newAssetValue || !selectedCompanyId) {
      toast.warning("Missing Fields", {
        description: "Please fill in all asset fields and select a company.",
      });
      return;
    }
    const parsedAssetValue = parseFloat(newAssetValue);
    if (isNaN(parsedAssetValue)) {
      toast.error("Invalid Input", {
        description: "Asset value must be a valid number.",
      });
      return;
    }

    try {
      await createAssetMutation.mutateAsync({
        assetType: newAssetType,
        assetName: newAssetName,
        assetValue: parsedAssetValue,
        companyId: selectedCompanyId,
      });
      toast.success("Asset Added", {
        description: "Your new asset has been successfully added.",
      });
      setNewAssetType("");
      setNewAssetName("");
      setNewAssetValue("");
      setSelectedCompanyId("");
    } catch (error: any) {
      toast.error("Failed to add asset", {
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  const handleToggleSoftDelete = async (asset: Asset) => {
    try {
      await updateAssetMutation.mutateAsync({
        id: asset.id,
        payload: { softDelete: asset.deletedAt === null ? true : false },
      });
      toast.info("Asset Status Updated", {
        description: `Asset "${asset.assetName}" ${asset.deletedAt === null ? "soft-deleted" : "restored"}.`,
      });
    } catch (error: any) {
      toast.error("Failed to update asset status", {
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  const handleHardDeleteAsset = async (assetId: string) => {
    if (!confirm("Are you sure you want to permanently delete this asset? This action cannot be undone.")) {
      return;
    }
    try {
      await deleteAssetMutation.mutateAsync(assetId);
      toast.success("Asset Deleted", {
        description: "The asset has been permanently deleted.",
      });
    } catch (error: any) {
      toast.error("Failed to delete asset", {
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Management</CardTitle>
        <CardDescription>Add and track your assets.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="newAssetType">Asset Type</Label>
            <Input
              id="newAssetType"
              placeholder="e.g., Real Estate, Stocks"
              value={newAssetType}
              onChange={(e) => setNewAssetType(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="newAssetName">Asset Name</Label>
            <Input
              id="newAssetName"
              placeholder="e.g., House, Tesla Shares"
              value={newAssetName}
              onChange={(e) => setNewAssetName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="newAssetValue">Asset Value</Label>
            <Input
              id="newAssetValue"
              type="number"
              placeholder="e.g., 500000"
              value={newAssetValue}
              onChange={(e) => setNewAssetValue(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            {isLoadingCompanies ? (
              <p>Loading companies...</p>
            ) : companies && companies.length > 0 ? (
              <Select onValueChange={setSelectedCompanyId} value={selectedCompanyId}>
                <SelectTrigger id="company">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-muted-foreground">No companies available. Please add a company first.</p>
            )}
          </div>
        </div>
        <Button
          onClick={handleAddAsset}
          className="mt-4"
          disabled={createAssetMutation.isPending || isLoadingCompanies || !companies || companies.length === 0}
        >
          {createAssetMutation.isPending ? "Adding Asset..." : "Add Asset"}
        </Button>

        <h3 className="text-lg font-semibold mt-6 mb-2">Current Assets</h3>
        {isLoadingAssets ? (
          <p>Loading assets...</p>
        ) : assets && assets.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assets.map((asset) => (
                  <tr key={asset.id} className={asset.deletedAt ? "bg-red-50 opacity-70" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{asset.assetName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.assetType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.company?.name || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₱{asset.assetValue.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {asset.deletedAt ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Soft-Deleted</span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleSoftDelete(asset)}
                        disabled={updateAssetMutation.isPending}
                      >
                        {asset.deletedAt ? "Restore" : "Soft Delete"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleHardDeleteAsset(asset.id)}
                        disabled={deleteAssetMutation.isPending}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-3 text-muted-foreground">No assets found. Add your first asset above!</p>
        )}
      </CardContent>
    </Card>
  );
}
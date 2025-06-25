// src/components/financial-management/modals/EditAssetModal.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
import { useUpdateAsset } from "@/hooks/financial-management/useAssets";
import { useCompanies } from "@/hooks/financial-management/useCompanies";
import { Asset } from "@/types";

interface EditAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null; // The asset to be edited
}

export function EditAssetModal({ isOpen, onClose, asset }: EditAssetModalProps) {
  const [assetType, setAssetType] = useState(asset?.assetType || "");
  const [assetName, setAssetName] = useState(asset?.assetName || "");
  const [assetValue, setAssetValue] = useState<string>(asset?.assetValue?.toString() || "");
  const [companyId, setCompanyId] = useState(asset?.companyId || "");

  const { data: companies, isLoading: isLoadingCompanies } = useCompanies();
  const updateAssetMutation = useUpdateAsset();

  // Update form fields when the asset prop changes (e.g., when a new asset is selected for editing)
  useEffect(() => {
    if (asset) {
      setAssetType(asset.assetType);
      setAssetName(asset.assetName);
      setAssetValue(asset.assetValue.toString());
      setCompanyId(asset.companyId);
    } else {
      // Reset if no asset is provided (e.g., when closing the modal)
      setAssetType("");
      setAssetName("");
      setAssetValue("");
      setCompanyId("");
    }
  }, [asset]);

  const handleUpdateAsset = async () => {
    if (!asset || !assetType || !assetName || !assetValue || !companyId) {
      toast.warning("Missing Fields", {
        description: "Please fill in all asset fields.",
      });
      return;
    }
    const parsedAssetValue = parseFloat(assetValue);
    if (isNaN(parsedAssetValue)) {
      toast.error("Invalid Input", {
        description: "Asset value must be a valid number.",
      });
      return;
    }

    try {
      await updateAssetMutation.mutateAsync({
        id: asset.id,
        payload: {
          assetType,
          assetName,
          assetValue: parsedAssetValue,
          companyId,
        },
      });
      toast.success("Asset Updated", {
        description: `Asset "${assetName}" has been successfully updated.`,
      });
      onClose(); // Close the modal on success
    } catch (error: any) {
      toast.error("Failed to update asset", {
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Asset</DialogTitle>
          <DialogDescription>
            Make changes to the asset here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assetType" className="text-right">
              Asset Type
            </Label>
            <Input
              id="assetType"
              placeholder="e.g., Real Estate, Stocks"
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assetName" className="text-right">
              Asset Name
            </Label>
            <Input
              id="assetName"
              placeholder="e.g., House, Tesla Shares"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assetValue" className="text-right">
              Asset Value
            </Label>
            <Input
              id="assetValue"
              type="number"
              placeholder="e.g., 500000"
              value={assetValue}
              onChange={(e) => setAssetValue(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">
              Company
            </Label>
            <div className="col-span-3">
              {isLoadingCompanies ? (
                <p>Loading companies...</p>
              ) : companies && companies.length > 0 ? (
                <Select onValueChange={setCompanyId} value={companyId}>
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
                <p className="text-muted-foreground text-sm">No companies available.</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleUpdateAsset}
            disabled={updateAssetMutation.isPending}
          >
            {updateAssetMutation.isPending ? "Saving changes..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
// src/components/financial-management/modals/AddAssetModal.tsx
import React, { useState } from "react";
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
import { useCreateAsset } from "@/hooks/financial-management/useAssets";
import { useCompanies } from "@/hooks/financial-management/useCompanies";

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddAssetModal({ isOpen, onClose }: AddAssetModalProps) {
  const [newAssetType, setNewAssetType] = useState("");
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetValue, setNewAssetValue] = useState<string>("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");

  const { data: companies, isLoading: isLoadingCompanies, error: companiesError } = useCompanies();
  const createAssetMutation = useCreateAsset();

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
      onClose(); // Close the modal on success
    } catch (error: any) {
      toast.error("Failed to add asset", {
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
          <DialogDescription>
            Enter the details for the new asset. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newAssetType" className="text-right">
              Asset Type
            </Label>
            <Input
              id="newAssetType"
              placeholder="e.g., Real Estate, Stocks"
              value={newAssetType}
              onChange={(e) => setNewAssetType(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newAssetName" className="text-right">
              Asset Name
            </Label>
            <Input
              id="newAssetName"
              placeholder="e.g., House, Tesla Shares"
              value={newAssetName}
              onChange={(e) => setNewAssetName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newAssetValue" className="text-right">
              Asset Value
            </Label>
            <Input
              id="newAssetValue"
              type="number"
              placeholder="e.g., 500000"
              value={newAssetValue}
              onChange={(e) => setNewAssetValue(e.target.value)}
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
                <p className="text-muted-foreground text-sm">No companies available. Please add a company first.</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleAddAsset}
            disabled={createAssetMutation.isPending || isLoadingCompanies || !companies || companies.length === 0}
          >
            {createAssetMutation.isPending ? "Adding Asset..." : "Add Asset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
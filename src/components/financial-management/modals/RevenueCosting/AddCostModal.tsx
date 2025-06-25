// src/components/financial-management/modals/AddCostModal.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useCreateCost } from "@/hooks/financial-management/useRevenueCost";
import { useCompanies } from "@/hooks/financial-management/useCompanies";
import { useAssets } from "@/hooks/financial-management/useAssets"; // Import useAssets

interface AddCostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCostModal({ isOpen, onClose }: AddCostModalProps) {
  const [newCostCategory, setNewCostCategory] = useState("");
  const [newCostAmount, setNewCostAmount] = useState<string>("");
  const [newCostDescription, setNewCostDescription] = useState("");
  const [newCostCompanyId, setNewCostCompanyId] = useState<string>("none");
  const [newCostAssetId, setNewCostAssetId] = useState<string>("none"); // New state for asset ID

  const { data: companies, isLoading: isLoadingCompanies } = useCompanies();
  const { data: assets, isLoading: isLoadingAssets } = useAssets(); // Fetch assets
  const createCostMutation = useCreateCost();

  const handleAddCost = async () => {
    if (!newCostCategory || !newCostAmount) {
      toast.warning("Missing Fields", {
        description: "Please fill in cost category and amount.",
      });
      return;
    }
    const parsedAmount = parseFloat(newCostAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Invalid Input", {
        description: "Cost amount must be a valid positive number.",
      });
      return;
    }

    try {
      await createCostMutation.mutateAsync({
        category: newCostCategory,
        amount: parsedAmount,
        description: newCostDescription,
        companyId: newCostCompanyId === "none" ? undefined : newCostCompanyId,
        assetId: newCostAssetId === "none" ? undefined : newCostAssetId, // Include newCostAssetId in payload
      });
      toast.success("Cost Added", {
        description: "New cost entry has been successfully added.",
      });
      // Reset form fields
      setNewCostCategory("");
      setNewCostAmount("");
      setNewCostDescription("");
      setNewCostCompanyId("none");
      setNewCostAssetId("none"); // Reset asset ID
      onClose(); // Close the modal on success
    } catch (err: any) {
      toast.error("Failed to add cost", {
        description: err.message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Cost</DialogTitle>
          <DialogDescription>
            Enter details for a new cost or expense.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="costCategory" className="text-right">
              Category
            </Label>
            <Input
              id="costCategory"
              placeholder="e.g., Rent, Salaries, Utilities"
              value={newCostCategory}
              onChange={(e) => setNewCostCategory(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="costAmount" className="text-right">
              Amount
            </Label>
            <Input
              id="costAmount"
              type="number"
              placeholder="e.g., 5000"
              value={newCostAmount}
              onChange={(e) => setNewCostAmount(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="costDescription" className="text-right">
              Description
            </Label>
            <Textarea
              id="costDescription"
              placeholder="Details about this cost."
              value={newCostDescription}
              onChange={(e) => setNewCostDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="costCompany" className="text-right">
              Company
            </Label>
            <div className="col-span-3">
              {isLoadingCompanies ? (
                <p>Loading companies...</p>
              ) : companies && companies.length > 0 ? (
                <Select onValueChange={setNewCostCompanyId} value={newCostCompanyId}>
                  <SelectTrigger id="costCompany">
                    <SelectValue placeholder="Select a company (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem> {/* Option to deselect */}
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
          {/* New Asset Select Field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="costAsset" className="text-right">
              Asset
            </Label>
            <div className="col-span-3">
              {isLoadingAssets ? (
                <p>Loading assets...</p>
              ) : assets && assets.length > 0 ? (
                <Select onValueChange={setNewCostAssetId} value={newCostAssetId}>
                  <SelectTrigger id="costAsset">
                    <SelectValue placeholder="Select an asset (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem> {/* Option to deselect */}
                    {assets.map((asset) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.assetName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-muted-foreground text-sm">No assets available.</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleAddCost}
            disabled={createCostMutation.isPending}
          >
            {createCostMutation.isPending ? "Adding Cost..." : "Add Cost"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
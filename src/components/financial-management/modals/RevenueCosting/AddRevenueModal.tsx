// src/components/financial-management/modals/AddRevenueModal.tsx
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
import { useCreateRevenue } from "@/hooks/financial-management/useRevenueCost";
import { useCompanies } from "@/hooks/financial-management/useCompanies";
import { useAssets } from "@/hooks/financial-management/useAssets"; // Import useAssets

interface AddRevenueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddRevenueModal({ isOpen, onClose }: AddRevenueModalProps) {
  const [newRevenueSource, setNewRevenueSource] = useState("");
  const [newRevenueAmount, setNewRevenueAmount] = useState<string>("");
  const [newRevenueDescription, setNewRevenueDescription] = useState("");
  const [newRevenueCompanyId, setNewRevenueCompanyId] = useState<string>("none");
  const [newRevenueAssetId, setNewRevenueAssetId] = useState<string>("none"); // New state for asset ID

  const { data: companies, isLoading: isLoadingCompanies } = useCompanies();
  const { data: assets, isLoading: isLoadingAssets } = useAssets(); // Fetch assets
  const createRevenueMutation = useCreateRevenue();

  const handleAddRevenue = async () => {
    if (!newRevenueSource || !newRevenueAmount) {
      toast.warning("Missing Fields", {
        description: "Please fill in revenue source and amount.",
      });
      return;
    }
    const parsedAmount = parseFloat(newRevenueAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Invalid Input", {
        description: "Revenue amount must be a valid positive number.",
      });
      return;
    }

    try {
      await createRevenueMutation.mutateAsync({
        source: newRevenueSource,
        amount: parsedAmount,
        description: newRevenueDescription,
        companyId: newRevenueCompanyId === "none" ? undefined : newRevenueCompanyId,
        assetId: newRevenueAssetId === "none" ? undefined : newRevenueAssetId, // Include newRevenueAssetId in payload
      });
      toast.success("Revenue Added", {
        description: "New revenue entry has been successfully added.",
      });
      // Reset form fields
      setNewRevenueSource("");
      setNewRevenueAmount("");
      setNewRevenueDescription("");
      setNewRevenueCompanyId("none");
      setNewRevenueAssetId("none"); // Reset asset ID
      onClose(); // Close the modal on success
    } catch (err: any) {
      toast.error("Failed to add revenue", {
        description: err.message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Revenue</DialogTitle>
          <DialogDescription>
            Enter details for the revenue generated.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="revenueSource" className="text-right">
              Source
            </Label>
            <Input
              id="revenueSource"
              placeholder="e.g., Sales, Investment Income"
              value={newRevenueSource}
              onChange={(e) => setNewRevenueSource(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="revenueAmount" className="text-right">
              Amount
            </Label>
            <Input
              id="revenueAmount"
              type="number"
              placeholder="e.g., 15000"
              value={newRevenueAmount}
              onChange={(e) => setNewRevenueAmount(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="revenueDescription" className="text-right">
              Description
            </Label>
            <Textarea
              id="revenueDescription"
              placeholder="Details about this revenue."
              value={newRevenueDescription}
              onChange={(e) => setNewRevenueDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="revenueCompany" className="text-right">
              Company
            </Label>
            <div className="col-span-3">
              {isLoadingCompanies ? (
                <p>Loading companies...</p>
              ) : companies && companies.length > 0 ? (
                <Select onValueChange={setNewRevenueCompanyId} value={newRevenueCompanyId}>
                  <SelectTrigger id="revenueCompany">
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
            <Label htmlFor="revenueAsset" className="text-right">
              Asset
            </Label>
            <div className="col-span-3">
              {isLoadingAssets ? (
                <p>Loading assets...</p>
              ) : assets && assets.length > 0 ? (
                <Select onValueChange={setNewRevenueAssetId} value={newRevenueAssetId}>
                  <SelectTrigger id="revenueAsset">
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
            onClick={handleAddRevenue}
            disabled={createRevenueMutation.isPending}
          >
            {createRevenueMutation.isPending ? "Adding Revenue..." : "Add Revenue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
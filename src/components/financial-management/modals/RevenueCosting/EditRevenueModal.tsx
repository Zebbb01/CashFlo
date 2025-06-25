// src/components/financial-management/modals/EditRevenueModal.tsx
import React, { useState, useEffect } from "react";
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
import { useUpdateRevenue } from "@/hooks/financial-management/useRevenueCost";
import { useCompanies } from "@/hooks/financial-management/useCompanies";
import { useAssets } from "@/hooks/financial-management/useAssets";
import { Revenue } from "@/types";

interface EditRevenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  revenue: Revenue | null;
}

export function EditRevenueModal({ isOpen, onClose, revenue }: EditRevenueModalProps) {
  const [source, setSource] = useState(revenue?.source || "");
  const [amount, setAmount] = useState<string>(revenue?.amount?.toString() || "");
  const [description, setDescription] = useState(revenue?.description || "");
  const [companyId, setCompanyId] = useState(revenue?.companyId || "");
  const [assetId, setAssetId] = useState(revenue?.assetId || "");

  const { data: companies, isLoading: isLoadingCompanies } = useCompanies();
  const { data: assets, isLoading: isLoadingAssets } = useAssets();
  const updateRevenueMutation = useUpdateRevenue();

  useEffect(() => {
    if (revenue) {
      setSource(revenue.source);
      setAmount(revenue.amount.toString());
      setDescription(revenue.description || "");
      setCompanyId(revenue.companyId || "");
      setAssetId(revenue.assetId || "");
    } else {
      // Reset if no revenue is provided (e.g., when closing the modal)
      setSource("");
      setAmount("");
      setDescription("");
      setCompanyId("");
      setAssetId("");
    }
  }, [revenue]);

  const handleUpdateRevenue = async () => {
    if (!revenue || !source || !amount) {
      toast.warning("Missing Fields", {
        description: "Please fill in all required revenue fields.",
      });
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Invalid Input", {
        description: "Amount must be a valid positive number.",
      });
      return;
    }

    try {
      await updateRevenueMutation.mutateAsync({
        id: revenue.id,
        payload: {
          source,
          amount: parsedAmount,
          description,
          companyId: companyId || null, // Pass null if empty to disconnect
          assetId: assetId || null,     // Pass null if empty to disconnect
        },
      });
      toast.success("Revenue Updated", {
        description: `Revenue from "${source}" has been successfully updated.`,
      });
      onClose();
    } catch (error: any) {
      toast.error("Failed to update revenue", {
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Revenue Entry</DialogTitle>
          <DialogDescription>
            Make changes to the revenue entry here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="source" className="text-right">
              Source
            </Label>
            <Input
              id="source"
              placeholder="e.g., Sales, Investment"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="e.g., 1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Optional details."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
                    <SelectValue placeholder="Select a company (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((comp) => (
                      <SelectItem key={comp.id} value={comp.id}>
                        {comp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-muted-foreground text-sm">No companies available.</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="asset" className="text-right">
              Asset
            </Label>
            <div className="col-span-3">
              {isLoadingAssets ? (
                <p>Loading assets...</p>
              ) : assets && assets.length > 0 ? (
                <Select onValueChange={setAssetId} value={assetId}>
                  <SelectTrigger id="asset">
                    <SelectValue placeholder="Select an asset (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map((ast) => (
                      <SelectItem key={ast.id} value={ast.id}>
                        {ast.assetName}
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
            onClick={handleUpdateRevenue}
            disabled={updateRevenueMutation.isPending}
          >
            {updateRevenueMutation.isPending ? "Saving changes..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
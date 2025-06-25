// src/components/financial-management/modals/EditCostModal.tsx
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
import { useUpdateCost } from "@/hooks/financial-management/useRevenueCost";
import { useCompanies } from "@/hooks/financial-management/useCompanies";
import { useAssets } from "@/hooks/financial-management/useAssets";
import { Cost } from "@/types";

interface EditCostModalProps {
  isOpen: boolean;
  onClose: () => void;
  cost: Cost | null;
}

export function EditCostModal({ isOpen, onClose, cost }: EditCostModalProps) {
  const [category, setCategory] = useState(cost?.category || "");
  const [amount, setAmount] = useState<string>(cost?.amount?.toString() || "");
  const [description, setDescription] = useState(cost?.description || "");
  const [companyId, setCompanyId] = useState(cost?.companyId || "");
  const [assetId, setAssetId] = useState(cost?.assetId || "");

  const { data: companies, isLoading: isLoadingCompanies } = useCompanies();
  const { data: assets, isLoading: isLoadingAssets } = useAssets();
  const updateCostMutation = useUpdateCost();

  useEffect(() => {
    if (cost) {
      setCategory(cost.category);
      setAmount(cost.amount.toString());
      setDescription(cost.description || "");
      setCompanyId(cost.companyId || "");
      setAssetId(cost.assetId || "");
    } else {
      // Reset if no cost is provided
      setCategory("");
      setAmount("");
      setDescription("");
      setCompanyId("");
      setAssetId("");
    }
  }, [cost]);

  const handleUpdateCost = async () => {
    if (!cost || !category || !amount) {
      toast.warning("Missing Fields", {
        description: "Please fill in all required cost fields.",
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
      await updateCostMutation.mutateAsync({
        id: cost.id,
        payload: {
          category,
          amount: parsedAmount,
          description,
          companyId: companyId || null,
          assetId: assetId || null,
        },
      });
      toast.success("Cost Updated", {
        description: `Cost in category "${category}" has been successfully updated.`,
      });
      onClose();
    } catch (error: any) {
      toast.error("Failed to update cost", {
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Cost Entry</DialogTitle>
          <DialogDescription>
            Make changes to the cost entry here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              placeholder="e.g., Rent, Salaries"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
              placeholder="e.g., 5000"
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
            onClick={handleUpdateCost}
            disabled={updateCostMutation.isPending}
          >
            {updateCostMutation.isPending ? "Saving changes..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
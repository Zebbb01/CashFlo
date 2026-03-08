// src/components/financial-management/modals/EditCostModal.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/currency-input";
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
import { useAssets } from "@/hooks/financial-management/useAssets";
import { Cost, User } from "@/types";

interface EditCostModalProps {
  isOpen: boolean;
  onClose: () => void;
  cost: Cost | null;
  users: User[];
  isLoadingUsers: boolean; // NEW: Pass isLoadingUsers as a prop
}

export function EditCostModal({ isOpen, onClose, cost, users, isLoadingUsers }: EditCostModalProps) {
  const [category, setCategory] = useState(cost?.category || "");
  const [amount, setAmount] = useState<string>(cost?.amount?.toString() || "");
  const [description, setDescription] = useState(cost?.description || "");
  const [bankAssetManagementId, setBankAssetManagementId] = useState<string | null>(cost?.bankAssetManagementId || null);
  const [incurredByUserId, setIncurredByUserId] = useState<string>(cost?.userId || "");

  const { data: assets, isLoading: isLoadingAssets } = useAssets();
  const updateCostMutation = useUpdateCost();

  useEffect(() => {
    if (cost) {
      setCategory(cost.category);
      setAmount(cost.amount.toString());
      setDescription(cost.description || "");
      setBankAssetManagementId(cost.bankAssetManagementId || null);
      setIncurredByUserId(cost.userId || "");
    } else {
      setCategory("");
      setAmount("");
      setDescription("");
      setBankAssetManagementId(null);
      setIncurredByUserId("");
    }
  }, [cost]);

  const handleUpdateCost = async () => {
    if (!cost || !category || !amount || !incurredByUserId) {
      toast.warning("Missing Fields", {
        description: "Please fill in all required cost fields, and select who incurred the cost.",
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

    if (!bankAssetManagementId) {
      toast.warning("Missing Link", {
        description: "Cost must be linked to a bank asset management.",
      });
      return;
    }

    try {
      await updateCostMutation.mutateAsync({
        id: cost.id,
        payload: {
          category,
          amount: parsedAmount,
          description: description || undefined,
          bankAssetManagementId: bankAssetManagementId,
          userId: incurredByUserId,
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
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-2xl font-bold">Edit Cost Entry</DialogTitle>
          <DialogDescription className="text-center">
            Make changes to the cost entry here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground font-semibold">
              Category
            </Label>
            <Input
              id="category"
              placeholder="e.g., Rent, Salaries"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-foreground font-semibold">
              Amount
            </Label>
            <CurrencyInput
              id="amount"
              placeholder="e.g., 5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Optional details."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bankAsset" className="text-foreground font-semibold">
              Linked Asset
            </Label>
            <div className="w-full">
              {isLoadingAssets ? (
                <p>Loading assets...</p>
              ) : assets && assets.length > 0 ? (
                <Select
                  onValueChange={(value) => {
                    setBankAssetManagementId(value === '__NULL__' ? null : value);
                  }}
                  value={bankAssetManagementId || '__NULL__'}
                >
                  <SelectTrigger id="bankAsset">
                    <SelectValue placeholder="Select a bank asset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__NULL__">None</SelectItem>
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
          <div className="space-y-2">
            <Label htmlFor="incurredByUser" className="text-foreground font-semibold">
              Incurred By
            </Label>
            <div className="w-full">
              {isLoadingUsers ? ( // Use isLoadingUsers prop here
                <p>Loading users...</p>
              ) : users && users.length > 0 ? (
                <Select onValueChange={setIncurredByUserId} value={incurredByUserId}>
                  <SelectTrigger id="incurredByUser">
                    <SelectValue placeholder="Select user who incurred cost" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-muted-foreground text-sm">No users available.</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-center pt-2">
          <Button
            type="submit"
            size="lg"
            variant="gradient"
            className="w-full max-w-sm"
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

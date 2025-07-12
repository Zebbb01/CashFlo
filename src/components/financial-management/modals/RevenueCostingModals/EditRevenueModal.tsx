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
import { useAssets } from "@/hooks/financial-management/useAssets";
import { Revenue, User } from "@/types";

interface EditRevenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  revenue: Revenue | null;
  users: User[];
  isLoadingUsers: boolean; // NEW: Pass isLoadingUsers as a prop
}

export function EditRevenueModal({ isOpen, onClose, revenue, users, isLoadingUsers }: EditRevenueModalProps) {
  const [source, setSource] = useState(revenue?.source || "");
  const [amount, setAmount] = useState<string>(revenue?.amount?.toString() || "");
  const [description, setDescription] = useState(revenue?.description || "");
  const [bankAssetManagementId, setBankAssetManagementId] = useState<string | null>(revenue?.bankAssetManagementId || null);
  const [recordedByUserId, setRecordedByUserId] = useState<string>(revenue?.userId || "");

  const { data: assets, isLoading: isLoadingAssets } = useAssets();
  const updateRevenueMutation = useUpdateRevenue();

  useEffect(() => {
    if (revenue) {
      setSource(revenue.source);
      setAmount(revenue.amount.toString());
      setDescription(revenue.description || "");
      setBankAssetManagementId(revenue.bankAssetManagementId || null);
      setRecordedByUserId(revenue.userId || "");
    } else {
      setSource("");
      setAmount("");
      setDescription("");
      setBankAssetManagementId(null);
      setRecordedByUserId("");
    }
  }, [revenue]);

  const handleUpdateRevenue = async () => {
    if (!revenue || !source || !amount || !recordedByUserId) {
      toast.warning("Missing Fields", {
        description: "Please fill in all required revenue fields, and select who recorded the revenue.",
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
        description: "Revenue must be linked to a bank asset management.",
      });
      return;
    }

    try {
      await updateRevenueMutation.mutateAsync({
        id: revenue.id,
        payload: {
          source,
          amount: parsedAmount,
          description: description || undefined,
          bankAssetManagementId: bankAssetManagementId,
          userId: recordedByUserId,
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
            <Label htmlFor="bankAsset" className="text-right">
              Bank Asset
            </Label>
            <div className="col-span-3">
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
                        {asset.assetName} (Company: {asset.company?.name || 'N/A'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-muted-foreground text-sm">No assets available.</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recordedByUser" className="text-right">
              Recorded By
            </Label>
            <div className="col-span-3">
              {isLoadingUsers ? ( // Use isLoadingUsers prop here
                <p>Loading users...</p>
              ) : users && users.length > 0 ? (
                <Select onValueChange={setRecordedByUserId} value={recordedByUserId}>
                  <SelectTrigger id="recordedByUser">
                    <SelectValue placeholder="Select user who recorded revenue" />
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

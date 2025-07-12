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
import { useAssets } from "@/hooks/financial-management/useAssets";
import { User } from "@/types";

interface AddRevenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  isLoadingUsers: boolean; // NEW: Pass isLoadingUsers as a prop
}

export function AddRevenueModal({ isOpen, onClose, users, isLoadingUsers }: AddRevenueModalProps) {
  const [newRevenueSource, setNewRevenueSource] = useState("");
  const [newRevenueAmount, setNewRevenueAmount] = useState<string>("");
  const [newRevenueDescription, setNewRevenueDescription] = useState("");
  const [newRevenueBankAssetManagementId, setNewRevenueBankAssetManagementId] = useState<string | null>(null);
  const [recordedByUserId, setRecordedByUserId] = useState<string>("");

  const { data: assets, isLoading: isLoadingAssets } = useAssets();
  const createRevenueMutation = useCreateRevenue();

  const currentAuthenticatedUserId = "some-authenticated-user-id"; // REPLACE THIS

  React.useEffect(() => {
    if (currentAuthenticatedUserId && !recordedByUserId) {
      setRecordedByUserId(currentAuthenticatedUserId);
    } else if (!currentAuthenticatedUserId && users.length > 0 && !recordedByUserId) {
      setRecordedByUserId(users[0].id);
    }
  }, [currentAuthenticatedUserId, users, recordedByUserId]);

  const handleAddRevenue = async () => {
    if (!newRevenueSource || !newRevenueAmount || !recordedByUserId) {
      toast.warning("Missing Fields", {
        description: "Please fill in revenue source, amount, and select who recorded the revenue.",
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

    if (!newRevenueBankAssetManagementId) {
      toast.warning("Missing Link", {
        description: "Revenue must be linked to a bank asset management.",
      });
      return;
    }

    try {
      await createRevenueMutation.mutateAsync({
        source: newRevenueSource,
        amount: parsedAmount,
        description: newRevenueDescription || undefined,
        bankAssetManagementId: newRevenueBankAssetManagementId,
        recordedByUserId: recordedByUserId,
      });
      toast.success("Revenue Added", {
        description: "New revenue entry has been successfully added.",
      });
      setNewRevenueSource("");
      setNewRevenueAmount("");
      setNewRevenueDescription("");
      setNewRevenueBankAssetManagementId(null);
      setRecordedByUserId("");
      onClose();
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
            <Label htmlFor="revenueBankAsset" className="text-right">
              Bank Asset
            </Label>
            <div className="col-span-3">
              {isLoadingAssets ? (
                <p>Loading assets...</p>
              ) : assets && assets.length > 0 ? (
                <Select
                  onValueChange={(value) => {
                    setNewRevenueBankAssetManagementId(value === '__NULL__' ? null : value);
                  }}
                  value={newRevenueBankAssetManagementId || '__NULL__'}
                >
                  <SelectTrigger id="revenueBankAsset">
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
            onClick={handleAddRevenue}
            disabled={createRevenueMutation.isPending || isLoadingAssets || isLoadingUsers || !recordedByUserId}
          >
            {createRevenueMutation.isPending ? "Adding Revenue..." : "Add Revenue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

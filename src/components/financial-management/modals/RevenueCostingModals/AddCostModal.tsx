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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useCreateCost } from "@/hooks/financial-management/useRevenueCost";
import { useAssets } from "@/hooks/financial-management/useAssets";
import { Asset, User } from "@/types";

interface AddCostModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  isLoadingUsers: boolean; // NEW: Pass isLoadingUsers as a prop
}

export function AddCostModal({ isOpen, onClose, users, isLoadingUsers }: AddCostModalProps) {
  const [newCostCategory, setNewCostCategory] = useState("");
  const [newCostAmount, setNewCostAmount] = useState<string>("");
  const [newCostDescription, setNewCostDescription] = useState("");
  const [newCostBankAssetManagementId, setNewCostBankAssetManagementId] = useState<string | null>(null);
  const [incurredByUserId, setIncurredByUserId] = useState<string>("");
  const [isManualAttribution, setIsManualAttribution] = useState(false);
  const [manualAttributionUserIdsInput, setManualAttributionUserIdsInput] = useState<string>("");

  const { data: assets, isLoading: isLoadingAssets } = useAssets();
  const createCostMutation = useCreateCost();

  const currentAuthenticatedUserId = "some-authenticated-user-id"; // REPLACE THIS

  React.useEffect(() => {
    if (currentAuthenticatedUserId && !incurredByUserId) {
      setIncurredByUserId(currentAuthenticatedUserId);
    } else if (!currentAuthenticatedUserId && users.length > 0 && !incurredByUserId) {
      setIncurredByUserId(users[0].id);
    }
  }, [currentAuthenticatedUserId, users, incurredByUserId]);


  const handleAddCost = async () => {
    if (!newCostCategory || !newCostAmount || !incurredByUserId) {
      toast.warning("Missing Fields", {
        description: "Please fill in cost category, amount, and select who incurred the cost.",
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

    if (!newCostBankAssetManagementId) {
      toast.warning("Missing Link", {
        description: "Cost must be linked to a bank asset management.",
      });
      return;
    }

    let attributedToUserIds: string[] | undefined = undefined;
    if (isManualAttribution) {
      const ids = manualAttributionUserIdsInput.split(',').map(id => id.trim()).filter(id => id);
      if (ids.length === 0) {
        toast.warning("Manual Attribution", { description: "Please enter at least one user ID for manual attribution." });
        return;
      }
      const invalidIds = ids.filter(id => !users.some(user => user.id === id));
      if (invalidIds.length > 0) {
        toast.error("Invalid User IDs", { description: `The following user IDs are invalid: ${invalidIds.join(', ')}` });
        return;
      }
      attributedToUserIds = ids;
    }

    try {
      await createCostMutation.mutateAsync({
        category: newCostCategory,
        amount: parsedAmount,
        description: newCostDescription || undefined,
        bankAssetManagementId: newCostBankAssetManagementId,
        incurredByUserId: incurredByUserId,
        attributedToUserIds: attributedToUserIds,
      });
      toast.success("Cost Added", {
        description: "New cost entry has been successfully added.",
      });
      setNewCostCategory("");
      setNewCostAmount("");
      setNewCostDescription("");
      setNewCostBankAssetManagementId(null);
      setIncurredByUserId("");
      setIsManualAttribution(false);
      setManualAttributionUserIdsInput("");
      onClose();
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
            <Label htmlFor="costBankAsset" className="text-right">
              Bank Asset
            </Label>
            <div className="col-span-3">
              {isLoadingAssets ? (
                <p>Loading assets...</p>
              ) : assets && assets.length > 0 ? (
                <Select
                  onValueChange={(value) => {
                    setNewCostBankAssetManagementId(value === '__NULL__' ? null : value);
                  }}
                  value={newCostBankAssetManagementId || '__NULL__'}
                >
                  <SelectTrigger id="costBankAsset">
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
            <Label htmlFor="incurredByUser" className="text-right">
              Incurred By
            </Label>
            <div className="col-span-3">
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

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="manualAttribution" className="text-right">
              Manual Attribution
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Checkbox
                id="manualAttribution"
                checked={isManualAttribution}
                onCheckedChange={(checked: boolean) => {
                  setIsManualAttribution(checked);
                  if (!checked) {
                    setManualAttributionUserIdsInput("");
                  }
                }}
              />
              <span className="text-sm">Specify who to attribute this cost to</span>
            </div>
          </div>

          {isManualAttribution && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="attributedToUsers" className="text-right">
                Attribute To (IDs)
              </Label>
              <Input
                id="attributedToUsers"
                placeholder="Comma-separated user IDs (e.g., user1id, user2id)"
                value={manualAttributionUserIdsInput}
                onChange={(e) => setManualAttributionUserIdsInput(e.target.value)}
                className="col-span-3"
              />
            </div>
          )}

        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleAddCost}
            disabled={createCostMutation.isPending || isLoadingAssets || isLoadingUsers || !incurredByUserId}
          >
            {createCostMutation.isPending ? "Adding Cost..." : "Add Cost"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

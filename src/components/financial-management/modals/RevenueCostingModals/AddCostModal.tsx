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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useCreateCost } from "@/hooks/financial-management/useRevenueCost";
import { useAssets } from "@/hooks/financial-management/useAssets";
import { User } from "@/types";
import { useAssetPartnershipsByAsset } from "@/hooks/financial-management/usePartnership";
import { useSession } from "next-auth/react";

interface AddCostModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  isLoadingUsers: boolean;
}

export function AddCostModal({ isOpen, onClose, users, isLoadingUsers }: AddCostModalProps) {
  const [newCostCategory, setNewCostCategory] = useState("");
  const [newCostAmount, setNewCostAmount] = useState<string>("");
  const [newCostDescription, setNewCostDescription] = useState("");
  const [newCostBankAssetManagementId, setNewCostBankAssetManagementId] = useState<string | null>(null);
  const [incurredByUserId, setIncurredByUserId] = useState<string>("");
  const [isManualAttribution, setIsManualAttribution] = useState(false);
  const [manualAttributionSelectedUserIds, setManualAttributionSelectedUserIds] = useState<string[]>([]);
  const [partnersOfSelectedAsset, setPartnersOfSelectedAsset] = useState<User[]>([]);

  const { data: assets, isLoading: isLoadingAssets } = useAssets();
  const createCostMutation = useCreateCost();
  const { data: session } = useSession();

  const { data: assetPartnershipsData, isLoading: isLoadingAssetPartnerships } = useAssetPartnershipsByAsset(
    newCostBankAssetManagementId || ""
  );

  const currentAuthenticatedUser = users.find(u => u.id === session?.user?.id);
  const currentAuthenticatedUserId = currentAuthenticatedUser?.id || null;

  useEffect(() => {
    if (!isLoadingUsers && users.length > 0) {
      if (currentAuthenticatedUserId && users.some(u => u.id === currentAuthenticatedUserId)) {
        setIncurredByUserId(currentAuthenticatedUserId);
      } else if (!incurredByUserId) {
        setIncurredByUserId(users[0].id);
      }
    } else if (!isLoadingUsers && users.length === 0 && !incurredByUserId) {
      setIncurredByUserId("");
      console.warn("No users available to set as 'Incurred By'.");
    }
  }, [currentAuthenticatedUserId, users, isLoadingUsers, incurredByUserId]);

  useEffect(() => {
    if (isManualAttribution && newCostBankAssetManagementId && assetPartnershipsData && users.length > 0 && assets) {
      const partnerUserIds = assetPartnershipsData.map((ap: { userId: any; }) => ap.userId);
      const selectedAsset = assets.find(asset => asset.id === newCostBankAssetManagementId);
      const ownerId = selectedAsset?.userId;

      const allAttributableUserIds = new Set(partnerUserIds);
      if (ownerId) {
        allAttributableUserIds.add(ownerId);
      }

      const filteredPartnersAndOwner = users.filter(user => allAttributableUserIds.has(user.id));
      setPartnersOfSelectedAsset(filteredPartnersAndOwner);

      setManualAttributionSelectedUserIds(prev =>
        prev.filter(id => allAttributableUserIds.has(id))
      );
    } else {
      setPartnersOfSelectedAsset([]);
      setManualAttributionSelectedUserIds([]);
    }
  }, [isManualAttribution, newCostBankAssetManagementId, assetPartnershipsData, users, assets]);

  const handleManualAttributionChange = (userId: string, isChecked: boolean) => {
    setManualAttributionSelectedUserIds((prev) =>
      isChecked ? [...prev, userId] : prev.filter((id) => id !== userId)
    );
  };

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
      if (manualAttributionSelectedUserIds.length === 0) {
        toast.warning("Manual Attribution", { description: "Please select at least one user for manual attribution." });
        return;
      }
      attributedToUserIds = manualAttributionSelectedUserIds;
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
      setManualAttributionSelectedUserIds([]);
      onClose();
    } catch (err: any) {
      toast.error("Failed to add cost", {
        description: err.message || "An unexpected error occurred.",
      });
    }
  };

  const selectedIncurredByUser = users.find(u => u.id === incurredByUserId);
  const incurredByUserName = selectedIncurredByUser?.name || selectedIncurredByUser?.email || "Unknown User";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        // Remove sm:max-w-[425px] or override it
        className="w-auto min-w-[425px] max-w-[calc(100vw-2rem)] sm:max-w-none md:max-w-max"
      >
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
            <CurrencyInput
              id="costAmount"
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
                    setManualAttributionSelectedUserIds([]);
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
                        {asset.assetName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-muted-foreground text-sm">No assets found. Please create an Asset first in the Asset Management section.</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recordedByUser" className="text-right">
              Incurred By
            </Label>
            <div className="col-span-3">
              {isLoadingUsers ? (
                <p>Loading user...</p>
              ) : (
                <Input
                  disabled
                  value={incurredByUserName}
                  className="col-span-3"
                />
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
                style={{ cursor: "pointer" }}
                checked={isManualAttribution}
                onCheckedChange={(checked: boolean) => {
                  setIsManualAttribution(checked);
                  if (!checked) {
                    setManualAttributionSelectedUserIds([]);
                  }
                }}
                disabled={!newCostBankAssetManagementId}
              />
              <span className="text-sm">Specify who to attribute this cost to</span>
              {!newCostBankAssetManagementId && (
                <p className="text-xs text-muted-foreground">(Select a bank asset to enable manual attribution)</p>
              )}
            </div>
          </div>

          {isManualAttribution && newCostBankAssetManagementId && (
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="attributedToUsers" className="text-right pt-2">
                Attribution To
              </Label>
              <div className="col-span-3">
                {isLoadingAssetPartnerships || isLoadingUsers ? (
                  <p>Loading partners and owner...</p>
                ) : partnersOfSelectedAsset.length > 0 ? (
                  <Select
                    onValueChange={() => { }} // No direct value change for multi-select
                    value={manualAttributionSelectedUserIds.length > 0 ? manualAttributionSelectedUserIds[0] : ""}
                  >
                    <SelectTrigger id="attributedToUsers">
                      {/* Removed 'truncate' from SelectValue */}
                      <SelectValue placeholder="Select owner and partners to attribute cost" >
                        {manualAttributionSelectedUserIds.length > 0
                          ? manualAttributionSelectedUserIds
                            .map((id) => partnersOfSelectedAsset.find((user) => user.id === id)?.name || partnersOfSelectedAsset.find((user) => user.id === id)?.email || id)
                            .join(", ")
                          : "Select owner and partners to attribute cost"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {partnersOfSelectedAsset.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-2 p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                          onClick={() => handleManualAttributionChange(user.id, !manualAttributionSelectedUserIds.includes(user.id))}
                        >
                          <Checkbox
                            checked={manualAttributionSelectedUserIds.includes(user.id)}
                            onCheckedChange={(checked: boolean) =>
                              handleManualAttributionChange(user.id, checked)
                            }
                          />
                          <span>{user.name || user.email}</span>
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-muted-foreground text-sm">No partners or owner available for this asset for attribution.</p>
                )}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleAddCost}
            disabled={createCostMutation.isPending || isLoadingAssets || isLoadingUsers || isLoadingAssetPartnerships || !incurredByUserId}
          >
            {createCostMutation.isPending ? "Adding Cost..." : "Add Cost"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
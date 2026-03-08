// src/components/financial-management/WithdrawalHistory.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useCosts, useCreateCost } from "@/hooks/financial-management/useRevenueCost";
import { useAssets } from "@/hooks/financial-management/useAssets";
import { useAssetPartnershipsByAsset } from "@/hooks/financial-management/usePartnership";
import { Cost, CreateCostPayload, User } from "@/types";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Calendar, Tag, FileText, Banknote } from "lucide-react";
import { useSession } from "next-auth/react";

interface WithdrawalHistoryProps {
  currentUserId: string;
  users: User[];
  isLoadingUsers: boolean;
}

export function WithdrawalHistory({ currentUserId, users, isLoadingUsers }: WithdrawalHistoryProps) {
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>("");
  const [withdrawalDescription, setWithdrawalDescription] = useState<string>("");
  const [withdrawalCategory, setWithdrawalCategory] = useState<string>("");
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [incurredByUserId, setIncurredByUserId] = useState<string>("");
  const [isManualAttribution, setIsManualAttribution] = useState(false);
  const [manualAttributionSelectedUserIds, setManualAttributionSelectedUserIds] = useState<string[]>([]);
  const [partnersOfSelectedAsset, setPartnersOfSelectedAsset] = useState<User[]>([]);

  const { data: session } = useSession();

  // Fetch user's assets
  const { data: userAssets, isLoading: isLoadingUserAssets } = useAssets();

  // Fetch costs (withdrawals) for the selected asset
  const { data: costs, isLoading: isLoadingCosts, error: costsError } = useCosts();

  // Fetch asset partnerships for the selected asset
  const { data: assetPartnershipsData, isLoading: isLoadingAssetPartnerships } = useAssetPartnershipsByAsset(
    selectedAssetId || ""
  );

  // Use the pre-configured useCreateCost hook
  const createCostMutation = useCreateCost();

  const currentAuthenticatedUser = users.find(u => u.id === session?.user?.id);
  const currentAuthenticatedUserId = currentAuthenticatedUser?.id || null;

  // Set initial selected asset to the first owned asset or empty
  useEffect(() => {
    if (userAssets && userAssets.length > 0 && !selectedAssetId) {
      const ownedAsset = userAssets.find(asset => asset.userId === currentUserId);
      if (ownedAsset) {
        setSelectedAssetId(ownedAsset.id);
      } else if (userAssets.length > 0) {
        setSelectedAssetId(userAssets[0].id);
      }
    }
  }, [userAssets, currentUserId, selectedAssetId]);

  // Set incurred by user (similar to AddCostModal)
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

  // Update partners of selected asset (similar to AddCostModal)
  useEffect(() => {
    if (isManualAttribution && selectedAssetId && assetPartnershipsData && users.length > 0 && userAssets) {
      const partnerUserIds = assetPartnershipsData.map((ap: { userId: any; }) => ap.userId);
      const selectedAsset = userAssets.find(asset => asset.id === selectedAssetId);
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
  }, [isManualAttribution, selectedAssetId, assetPartnershipsData, users, userAssets]);

  // Filter costs to show only those related to the selected asset
  const filteredCosts = useMemo(() => {
    if (!costs) return [];

    // If no asset is selected, return empty array to prompt user to select
    if (!selectedAssetId) return [];

    return costs
      .filter(cost => cost.bankAssetManagementId === selectedAssetId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [costs, selectedAssetId]);

  const handleManualAttributionChange = (userId: string, isChecked: boolean) => {
    setManualAttributionSelectedUserIds((prev) =>
      isChecked ? [...prev, userId] : prev.filter((id) => id !== userId)
    );
  };

  const handleAddWithdrawal = async () => {
    if (!withdrawalCategory || !withdrawalAmount || !incurredByUserId) {
      toast.warning("Missing Fields", {
        description: "Please fill in cost category, amount, and select who incurred the cost.",
      });
      return;
    }

    const parsedAmount = parseFloat(withdrawalAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Invalid Input", {
        description: "Cost amount must be a valid positive number.",
      });
      return;
    }

    if (!selectedAssetId) {
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
        category: withdrawalCategory,
        amount: parsedAmount,
        description: withdrawalDescription || undefined,
        bankAssetManagementId: selectedAssetId,
        incurredByUserId: incurredByUserId,
        attributedToUserIds: attributedToUserIds,
      });
      toast.success("Withdrawal Added", {
        description: "New withdrawal entry has been successfully added.",
      });
      setWithdrawalAmount("");
      setWithdrawalDescription("");
      setWithdrawalCategory("");
      setIsManualAttribution(false);
      setManualAttributionSelectedUserIds([]);
    } catch (err: any) {
      toast.error("Failed to add withdrawal", {
        description: err.message || "An unexpected error occurred.",
      });
    }
  };

  const selectedIncurredByUser = users.find(u => u.id === incurredByUserId);
  const incurredByUserName = selectedIncurredByUser?.name || selectedIncurredByUser?.email || "Unknown User";

  // Define columns for the DataTable
  const columns: {
    header: string | React.ReactNode;
    accessorKey?: string;
    cell: (row: Cost) => React.ReactNode;
  }[] = [
      {
        accessorKey: "date",
        header: "Date",
        cell: (row) => <span className="text-muted-foreground">{new Date(row.date).toLocaleDateString('en-PH')}</span>,
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: (row) => <span className="font-medium text-foreground">{row.description || 'N/A'}</span>,
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: (row) => <span className="text-sm text-gray-500">{row.category}</span>,
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: (row) => (
          <span className="font-semibold text-red-600">
            -₱{row.amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        ),
      },
      {
        header: "Incurred By",
        // Now directly access row.user due to Prisma relation and type update
        cell: (row) => <span className="text-sm">{row.user?.name || "N/A"}</span>,
      },
      {
        header: "Attributed To",
        cell: (row) => {
          if (!row.costAttributions || row.costAttributions.length === 0) {
            return <span className="text-sm text-muted-foreground">Auto (Shared)</span>;
          }
          const attributedUsers = row.costAttributions.map(attribution => {
            return attribution.user?.name || attribution.user?.email || "Unknown";
          }).join(", ");
          return <span className="text-sm">{attributedUsers}</span>;
        },
      },
    ];

  if (!userAssets || userAssets.length === 0) {
    return (
      <Card className="glass-card border-0 shadow-2xl">
        <CardContent className="p-6 text-yellow-600">
          You need to create at least one asset to record withdrawals (costs). Please create an asset first.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl text-gradient-primary">
          Record New Withdrawal (Cost)
        </CardTitle>
        <CardDescription>
          Enter details for a new financial outflow. This will be recorded as a cost against your selected asset.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mb-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="withdrawalCategory" className="text-right">
              Category
            </Label>
            <Input
              id="withdrawalCategory"
              placeholder="e.g., Rent, Salaries, Utilities"
              value={withdrawalCategory}
              onChange={(e) => setWithdrawalCategory(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="withdrawalAmount" className="text-right">
              Amount
            </Label>
            <Input
              id="withdrawalAmount"
              type="number"
              placeholder="e.g., 5000"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="withdrawalDescription" className="text-right">
              Description
            </Label>
            <Textarea
              id="withdrawalDescription"
              placeholder="Details about this withdrawal."
              value={withdrawalDescription}
              onChange={(e) => setWithdrawalDescription(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bankAsset" className="text-right">
              Bank Asset
            </Label>
            <div className="col-span-3">
              {isLoadingUserAssets ? (
                <p>Loading assets...</p>
              ) : userAssets && userAssets.length > 0 ? (
                <Select
                  onValueChange={(value) => {
                    setSelectedAssetId(value === '__NULL__' ? null : value);
                    setManualAttributionSelectedUserIds([]);
                  }}
                  value={selectedAssetId || '__NULL__'}
                >
                  <SelectTrigger id="bankAsset">
                    <SelectValue placeholder="Select a bank asset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__NULL__">None</SelectItem>
                    {userAssets.map((asset) => (
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

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="incurredByUser" className="text-right">
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
                disabled={!selectedAssetId}
              />
              <span className="text-sm">Specify who to attribute this cost to</span>
              {!selectedAssetId && (
                <p className="text-xs text-muted-foreground">(Select a bank asset to enable manual attribution)</p>
              )}
            </div>
          </div>

          {isManualAttribution && selectedAssetId && (
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

        <Button
          onClick={handleAddWithdrawal}
          className="mt-4 btn-gradient-primary w-full md:w-auto"
          disabled={createCostMutation.isPending || isLoadingUserAssets || isLoadingUsers || isLoadingAssetPartnerships || !incurredByUserId}
        >
          {createCostMutation.isPending ? "Recording..." : "Record New Withdrawal (Cost)"}
        </Button>

        <h3 className="text-xl font-semibold mt-8 mb-4 text-primary">Recent Withdrawals (Costs)</h3>

        {/* Dynamic Asset Selection for Table Viewing */}
        <div className="mb-4">
          <Label htmlFor="viewAssetSelect" className="text-sm font-medium mb-2 block">
            Select Asset to View History
          </Label>
          {isLoadingUserAssets ? (
            <Skeleton className="h-10" />
          ) : userAssets && userAssets.length > 0 ? (
            <Select
              onValueChange={(value) => {
                setSelectedAssetId(value === '__NULL__' ? null : value);
              }}
              value={selectedAssetId || '__NULL__'}
            >
              <SelectTrigger id="viewAssetSelect" className="">
                <Banknote className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <SelectValue placeholder="Select an asset to view history" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__NULL__" disabled>All Assets</SelectItem>
                {userAssets.map((asset) => (
                  <SelectItem key={asset.id} value={asset.id}>
                    {asset.assetName || `Asset ID: ${asset.id.substring(0, 8)}...`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-muted-foreground text-sm">No assets available.</p>
          )}
        </div>

        <div className="rounded-lg overflow-hidden">
          {selectedAssetId ? (
            filteredCosts.length > 0 ? (
              <DataTable
                columns={columns}
                data={filteredCosts}
                noDataMessage="No recent withdrawals found for this asset."
              />
            ) : (
              <p className="p-4 text-muted-foreground text-center">
                No withdrawal history for "{userAssets?.find(a => a.id === selectedAssetId)?.assetName || 'Selected Asset'}" yet. Record one above!
              </p>
            )
          ) : (
            <p className="p-4 text-muted-foreground text-center">
              Please select an asset above to view its withdrawal history.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
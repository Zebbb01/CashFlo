// src/components/financial-management/modals/AddRevenueModal.tsx
import React, { useState, useEffect } from "react"; // Import useEffect
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
import { useCreateRevenue } from "@/hooks/financial-management/useRevenueCost";
import { useAssets } from "@/hooks/financial-management/useAssets";
import { User } from "@/types";
import { useSession } from "next-auth/react";

interface AddRevenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  isLoadingUsers: boolean;
}

export function AddRevenueModal({ isOpen, onClose, users, isLoadingUsers }: AddRevenueModalProps) {
  const [newRevenueSource, setNewRevenueSource] = useState("");
  const [newRevenueAmount, setNewRevenueAmount] = useState<string>("");
  const [newRevenueDescription, setNewRevenueDescription] = useState("");
  const [newRevenueBankAssetManagementId, setNewRevenueBankAssetManagementId] = useState<string | null>(null);
  const [recordedByUserId, setRecordedByUserId] = useState<string | null>(null);
  const { data: session, status } = useSession();

  const { data: assets, isLoading: isLoadingAssets } = useAssets();
  const createRevenueMutation = useCreateRevenue();

  // IMPORTANT: This needs to come from your actual authentication context/hook.
  // For demonstration, let's assume you have a way to get the current user's ID.
  // Replace `useAuth` with your actual authentication hook/context.
  // Example: const { user: authUser, isLoading: isLoadingAuth } = useAuth();
  // For now, let's keep it as a placeholder, but understand this is the primary source of truth.
  const currentAuthenticatedUser: User | undefined = users.find(u => u.id === session?.user?.id);
  const currentAuthenticatedUserId = currentAuthenticatedUser?.id || null;

  useEffect(() => {
    // This effect ensures recordedByUserId is set based on available user data
    if (!isLoadingUsers && users.length > 0) {
      if (currentAuthenticatedUserId) {
        // If an authenticated user exists and is in the 'users' list
        if (users.some(u => u.id === currentAuthenticatedUserId)) {
          setRecordedByUserId(currentAuthenticatedUserId);
        } else {
          // If authenticated user ID is not found in the fetched 'users' list, default to first available user
          setRecordedByUserId(users[0].id);
          console.warn("Authenticated user ID not found in fetched users list. Defaulting to first user.");
        }
      } else if (!recordedByUserId) {
        // If no authenticated user, and recordedByUserId is not yet set, default to the first user in the list
        setRecordedByUserId(users[0].id);
      }
    } else if (!isLoadingUsers && users.length === 0 && !recordedByUserId) {
      // Handle case where there are no users available at all
      setRecordedByUserId(null); // Explicitly set to null if no users
      console.warn("No users available to set as 'Recorded By'.");
    }
  }, [currentAuthenticatedUserId, users, isLoadingUsers, recordedByUserId]); // Depend on isLoadingUsers as well

  // Derived state for display purposes
  const selectedUser = users.find((u) => u.id === recordedByUserId);
  const recordedByUserName = selectedUser?.name || selectedUser?.email || "Unknown User";


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
      // Reset form fields
      setNewRevenueSource("");
      setNewRevenueAmount("");
      setNewRevenueDescription("");
      setNewRevenueBankAssetManagementId(null);
      // Do NOT reset recordedByUserId to null immediately after success
      // Let the useEffect handle it on next open or keep the pre-selected user.
      // setRecordedByUserId(null); // <-- Removed this to prevent immediate reset
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
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-2xl font-bold">Add New Revenue</DialogTitle>
          <DialogDescription className="text-center">
            Enter details for the revenue generated.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="revenueSource" className="text-foreground font-semibold">
              Source
            </Label>
            <Input
              id="revenueSource"
              placeholder="e.g., Sales, Investment Income"
              value={newRevenueSource}
              onChange={(e) => setNewRevenueSource(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="revenueAmount" className="text-foreground font-semibold">
              Amount
            </Label>
            <CurrencyInput
              id="revenueAmount"
              placeholder="e.g., 15000"
              value={newRevenueAmount}
              onChange={(e) => setNewRevenueAmount(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="revenueDescription" className="text-foreground font-semibold">
              Description
            </Label>
            <Textarea
              id="revenueDescription"
              placeholder="Details about this revenue."
              value={newRevenueDescription}
              onChange={(e) => setNewRevenueDescription(e.target.value)}
              className="w-full min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="revenueBankAsset" className="text-foreground font-semibold">
              Linked Asset
            </Label>
            <div className="w-full">
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

          <div className="space-y-2">
            <Label htmlFor="recordedByUser" className="text-foreground font-semibold">
              Recorded By
            </Label>
            <div className="w-full">
              {isLoadingUsers ? (
                <p>Loading user...</p>
              ) : (
                <Input
                  disabled
                  value={recordedByUserName} // Use the derived state here
                  className="w-full bg-muted/50"
                />
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
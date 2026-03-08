// src\components\financial-management\modals\ColleagueManagement\ColleagueManagementModal.tsx
'use client';

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  useAssetPartnerships,
  useSendPartnershipInvitation,
  useUpdateAssetPartnership,
  useDeactivateAssetPartnership
} from "@/hooks/financial-management/useAssets";
import { Asset, AssetPartnership, User, SendPartnershipInvitationPayload, UpdateAssetPartnershipPayload } from "@/types";

interface ColleagueManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAsset: Asset | null;
  users: User[];
  currentUserId: string;
}

export function ColleagueManagementModal({ isOpen, onClose, selectedAsset, users, currentUserId }: ColleagueManagementModalProps) {
  const [newPartnerId, setNewPartnerId] = useState<string>("");
  const [newPartnerShare, setNewPartnerShare] = useState<string>("");
  const [newPartnerMessage, setNewPartnerMessage] = useState<string>("");

  // useAssetPartnerships fetches the `AssetColleaguesResponse` type, which contains `partnerships: any[]`
  // It also includes `totalAllocated` and `availablePercentage`. This is appropriate for the modal.
  const { data: assetPartnershipsData, isLoading: isLoadingAssetPartnerships } = useAssetPartnerships(selectedAsset?.id || '');
  const sendInvitationMutation = useSendPartnershipInvitation();
  const updatePartnershipMutation = useUpdateAssetPartnership();
  const deactivatePartnershipMutation = useDeactivateAssetPartnership();

  // Determine if the current user is the owner of the selected asset
  // CORRECTED LINE: Use optional chaining and nullish coalescing for safety
  const isOwner = selectedAsset?.userId === currentUserId;

  const handleSendInvitation = async () => {
    if (!selectedAsset?.id || !newPartnerId || !newPartnerShare) {
      toast.warning("Missing Fields", { description: "Please select a partner and specify a share percentage." });
      return;
    }
    const share = parseFloat(newPartnerShare);
    if (isNaN(share) || share <= 0 || share > 100) {
      toast.error("Invalid Share", { description: "Share percentage must be a number between 0.01 and 100." });
      return;
    }

    // Check if the selected partner is already part of the asset
    const existingPartnership = assetPartnershipsData?.partnerships.some(
      (p: any) => p.userId === newPartnerId
    );
    if (existingPartnership) {
      toast.info("Partner Exists", { description: "This user is already a partner or has a pending invitation for this asset." });
      return;
    }


    try {
      await sendInvitationMutation.mutateAsync({
        assetId: selectedAsset.id,
        payload: {
          senderId: currentUserId,
          receiverId: newPartnerId,
          sharePercentage: share,
          message: newPartnerMessage || undefined,
        },
      });
      toast.success("Invitation Sent", { description: "Partnership invitation sent successfully." });
      setNewPartnerId("");
      setNewPartnerShare("");
      setNewPartnerMessage("");
    } catch (error: any) {
      toast.error("Failed to Send Invitation", { description: error.message || "An unexpected error occurred." });
    }
  };

  const handleUpdatePartnership = async (partnership: AssetPartnership, newSharePercentage?: number, newIsActive?: boolean) => {
    if (!isOwner && partnership.userId !== currentUserId) { // Ensure only owner can manage others, or user can manage their own
      toast.error("Unauthorized", { description: "You are not authorized to update this partnership." });
      return;
    }
    try {
      await updatePartnershipMutation.mutateAsync({
        assetId: partnership.assetId,
        userId: partnership.userId,
        payload: {
          sharePercentage: newSharePercentage,
          isActive: newIsActive,
        },
      });
      toast.success("Partnership Updated", { description: "Partnership details updated successfully." });
    } catch (error: any) {
      toast.error("Failed to Update Partnership", { description: error.message || "An unexpected error occurred." });
    }
  };

  const handleDeactivatePartnership = async (partnership: AssetPartnership) => {
    // Only owner can deactivate others. A partner can "leave" (deactivate themselves)
    if (!isOwner && partnership.userId !== currentUserId) {
      toast.error("Unauthorized", { description: "You are not authorized to deactivate this partnership." });
      return;
    }
    // Prevent owner from deactivating themselves if they are the only partner or it breaks something critical.
    // This logic might need refinement based on business rules.
    if (isOwner && partnership.userId === currentUserId && assetPartnershipsData?.partnerships.length === 1) {
        toast.error("Cannot Deactivate", { description: "As the owner, you cannot deactivate yourself if you are the only partner. Consider deleting the asset if it's no longer needed." });
        return;
    }

    try {
      await deactivatePartnershipMutation.mutateAsync({
        assetId: partnership.assetId,
        userId: partnership.userId,
      });
      toast.success("Partner Deactivated", { description: `Partner ${partnership.userId === currentUserId ? 'left' : 'deactivated for'} this asset.` });
    } catch (error: any) {
      toast.error("Failed to Deactivate Partner", { description: error.message || "An unexpected error occurred." });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Manage Colleagues for "{selectedAsset?.assetName}"</DialogTitle>
          <DialogDescription>
            View and manage partners for this asset.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <h4 className="font-semibold">Current Partners:</h4>
          {isLoadingAssetPartnerships ? (
            <div>Loading partnerships...</div>
          ) : assetPartnershipsData?.partnerships && assetPartnershipsData.partnerships.length > 0 ? (
            <div className="space-y-2">
              {/* Ensure p.user is available for display; add checks if needed */}
              {assetPartnershipsData.partnerships.map((p: any) => ( // Cast to any or define a more specific type if `p.user` isn't in AssetPartnership
                <div key={p.id} className="flex justify-between items-center p-2 border rounded-md">
                  <span>{p.user?.name || p.user?.email} ({p.sharePercentage}%) - {p.isActive ? "Active" : "Inactive"}</span>
                  {/* Conditional actions based on ownership and partner identity */}
                  <div className="flex gap-2">
                    {/* Owner can activate/deactivate others */}
                    {isOwner && p.userId !== currentUserId && (
                      <Button variant="default" size="sm" onClick={() => handleUpdatePartnership(p, undefined, !p.isActive)}
                        disabled={updatePartnershipMutation.isPending}>
                        {p.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    )}
                    {/* Owner can remove any partner (except potentially themselves if it's the only one) */}
                    {isOwner && p.userId !== currentUserId && (
                      <Button variant="outlineDestructive" size="sm" onClick={() => handleDeactivatePartnership(p)}
                        disabled={deactivatePartnershipMutation.isPending}>Remove</Button>
                    )}
                    {/* A partner (who is not the owner of this asset) can leave */}
                    {!isOwner && p.userId === currentUserId && p.isActive && (
                       <Button variant="outlineDestructive" size="sm" onClick={() => handleDeactivatePartnership(p)}
                          disabled={deactivatePartnershipMutation.isPending}>Leave Partnership</Button>
                    )}
                    {/* Owner managing their own share if they are also a partner in this asset */}
                    {isOwner && p.userId === currentUserId && p.isActive && (
                      <Button variant="outline" size="sm" onClick={() => toast.info("Feature Coming Soon", { description: "Owners managing their own share percentage is coming soon!" })}>
                          Update My Share
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <p className="text-sm text-muted-foreground mt-2">Total Allocated: {assetPartnershipsData.totalAllocated.toFixed(2)}% | Available: {assetPartnershipsData.availablePercentage.toFixed(2)}%</p>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No active partners for this asset yet.</p>
          )}

          {/* Conditional rendering for the "Invite New Partner" section */}
          {isOwner && (
            <>
              <Separator className="my-4" />
              <h4 className="font-semibold">Invite New Partner:</h4>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newPartner" className="text-right">Partner</Label>
                <div className="col-span-3">
                  {users && users.length > 0 ? (
                    <Select onValueChange={setNewPartnerId} value={newPartnerId}>
                      <SelectTrigger id="newPartner">
                        <SelectValue placeholder="Select a user to invite" />
                      </SelectTrigger>
                      <SelectContent>
                        {users
                            .filter(user => user.id !== currentUserId) // Don't allow inviting self if already owner
                            .filter(user => !assetPartnershipsData?.partnerships.some((p: any) => p.userId === user.id)) // Filter out already partnered users
                            .map(user => (
                            <SelectItem key={user.id} value={user.id}>{user.name || user.email}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-muted-foreground text-sm">No users available to invite.</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newPartnerShare" className="text-right">Share (%)</Label>
                <Input
                  id="newPartnerShare"
                  type="number"
                  placeholder="e.g., 50"
                  value={newPartnerShare}
                  onChange={(e) => setNewPartnerShare(e.target.value)}
                  className="col-span-3"
                  min="0.01"
                  max="100"
                  step="0.01"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newPartnerMessage" className="text-right">Message (Optional)</Label>
                <Textarea
                  id="newPartnerMessage"
                  placeholder="e.g., Let's grow this together!"
                  value={newPartnerMessage}
                  onChange={(e) => setNewPartnerMessage(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <Button
                onClick={handleSendInvitation}
                disabled={
                  sendInvitationMutation.isPending ||
                  !newPartnerId ||
                  !newPartnerShare ||
                  !selectedAsset ||
                  (users?.length === 0) ||
                  (parseFloat(newPartnerShare) <= 0 || parseFloat(newPartnerShare) > 100) // Disable if share is invalid
                }
              >
                {sendInvitationMutation.isPending ? "Sending Invitation..." : "Send Invitation"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
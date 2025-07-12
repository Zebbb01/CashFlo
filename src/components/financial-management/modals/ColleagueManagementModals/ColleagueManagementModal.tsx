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
  currentUserId: string; // Add currentUserId to props
}

export function ColleagueManagementModal({ isOpen, onClose, selectedAsset, users, currentUserId }: ColleagueManagementModalProps) {
  const [newPartnerId, setNewPartnerId] = useState<string>("");
  const [newPartnerShare, setNewPartnerShare] = useState<string>("");
  const [newPartnerMessage, setNewPartnerMessage] = useState<string>("");

  const { data: assetPartnershipsData, isLoading: isLoadingAssetPartnerships } = useAssetPartnerships(selectedAsset?.id || '');
  const sendInvitationMutation = useSendPartnershipInvitation();
  const updatePartnershipMutation = useUpdateAssetPartnership();
  const deactivatePartnershipMutation = useDeactivateAssetPartnership();

  // Determine if the current user is the owner of the selected asset
  // CORRECTED LINE: Ensure selectedAsset and selectedAsset.ownerId are not null/undefined
  const isOwner = selectedAsset?.userId !== null && selectedAsset?.userId === currentUserId;


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

    try {
      // Ensure senderId is explicitly the current user's ID
      await sendInvitationMutation.mutateAsync({
        assetId: selectedAsset.id,
        payload: {
          senderId: currentUserId, // Explicitly pass senderId
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
    if (!isOwner) { // This check relies on the corrected isOwner logic
      toast.error("Unauthorized", { description: "Only the asset owner can manage partnerships." });
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
    if (!isOwner) { // This check relies on the corrected isOwner logic
      toast.error("Unauthorized", { description: "Only the asset owner can deactivate partnerships." });
      return;
    }
    try {
      await deactivatePartnershipMutation.mutateAsync({
        assetId: partnership.assetId,
        userId: partnership.userId,
      });
      toast.success("Partner Deactivated", { description: "Partner successfully deactivated for this asset." });
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
              {assetPartnershipsData.partnerships.map(p => (
                <div key={p.id} className="flex justify-between items-center p-2 border rounded-md">
                  <span>{p.user?.name || p.user?.email} ({p.sharePercentage}%) - {p.isActive ? "Active" : "Inactive"}</span>
                  {isOwner && ( // Only owner can manage other partners
                    <div className="flex gap-2">
                      {p.userId !== currentUserId && ( // Owner can deactivate/activate anyone but themselves
                        <>
                           <Button variant="outline" size="sm" onClick={() => handleUpdatePartnership(p, undefined, !p.isActive)}>
                            {p.isActive ? "Deactivate" : "Activate"}
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeactivatePartnership(p)}>Remove</Button>
                        </>
                      )}
                       {/* Owner can update their own share if they are also a partner */}
                       {p.userId === currentUserId && p.isActive && (
                          <Button variant="outline" size="sm" onClick={() => toast.info("Feature Coming Soon", { description: "Owners managing their own share percentage is coming soon!" })}>
                             Update My Share
                          </Button>
                       )}
                    </div>
                  )}
                  {!isOwner && p.userId === currentUserId && p.isActive && (
                      <Button variant="destructive" size="sm" onClick={() => handleDeactivatePartnership(p)}>Leave Partnership</Button>
                  )}
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
                        {users.map(user => (
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
                disabled={sendInvitationMutation.isPending || !newPartnerId || !newPartnerShare || !selectedAsset || users?.length === 0}
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
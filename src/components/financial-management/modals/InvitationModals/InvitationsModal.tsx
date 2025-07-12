'use client';

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useUserInvitations, useRespondToInvitation } from "@/hooks/financial-management/useInvitations";
import { PartnershipInvitation } from "@/types";

interface InvitationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string; // The ID of the currently authenticated user
}

export function InvitationsModal({ isOpen, onClose, currentUserId }: InvitationsModalProps) {
  const { data: userInvitations, isLoading: isLoadingUserInvitations } = useUserInvitations(currentUserId, 'received');
  const respondToInvitationMutation = useRespondToInvitation();

  const handleRespondToInvitation = async (invitation: PartnershipInvitation, action: 'accept' | 'reject') => {
    if (!currentUserId) {
      toast.error("Authentication Error", { description: "User not authenticated." });
      return;
    }

    try {
      await respondToInvitationMutation.mutateAsync({
        userId: currentUserId,
        invitationId: invitation.id,
        payload: { action },
      });
      toast.success("Invitation Processed", { description: `Invitation ${action}ed successfully.` });
    } catch (error: any) {
      toast.error("Failed to Process Invitation", { description: error.message || "An unexpected error occurred." });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>My Partnership Invitations</DialogTitle>
          <DialogDescription>
            Review invitations to join asset partnerships.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isLoadingUserInvitations ? (
            <div>Loading invitations...</div>
          ) : userInvitations && userInvitations.length > 0 ? (
            <div className="space-y-3">
              {userInvitations.map(invitation => (
                <Card key={invitation.id} className="p-4">
                  <CardTitle className="text-lg">{invitation.asset?.assetName || 'Unknown Asset'}</CardTitle>
                  <CardDescription>
                    From: {invitation.sender?.name || invitation.sender?.email || 'N/A'}
                  </CardDescription>
                  <div className="mt-2 text-sm">
                    <p>Proposed Share: <strong>{invitation.sharePercentage}%</strong></p>
                    <p>Status: <span className={`font-semibold ${invitation.status === 'PENDING' ? 'text-blue-500' : 'text-gray-500'}`}>{invitation.status}</span></p>
                    {invitation.message && <p>Message: "{invitation.message}"</p>}
                    {invitation.expiresAt && <p>Expires: {new Date(invitation.expiresAt).toLocaleDateString()}</p>}
                  </div>
                  {invitation.status === 'PENDING' && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => handleRespondToInvitation(invitation, 'accept')}
                        disabled={respondToInvitationMutation.isPending}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleRespondToInvitation(invitation, 'reject')}
                        disabled={respondToInvitationMutation.isPending}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No pending invitations.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

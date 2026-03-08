// src/components/layout/bell-notification.tsx
'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useUserInvitations } from "@/hooks/financial-management/useInvitations"; // Adjust path as needed
import { InvitationsModal } from "@/components/financial-management/modals/InvitationModals/InvitationsModal"; // Adjust path as needed

interface BellNotificationProps {
  currentUserId: string;
}

export function BellNotification({ currentUserId }: BellNotificationProps) {
  const [isViewInvitationsModalOpen, setIsViewInvitationsModalOpen] = React.useState(false);

  // Fetch only PENDING invitations to show in the badge
  const { data: userInvitations, isLoading: isLoadingUserInvitations } = useUserInvitations(currentUserId, 'received');

  const pendingInvitationsCount = userInvitations?.length || 0;

  const handleViewInvitations = () => {
    setIsViewInvitationsModalOpen(true);
  };

  if (!currentUserId) {
    return null; // Don't render if user ID is not available (e.g., still loading session client-side)
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleViewInvitations}
        disabled={isLoadingUserInvitations || pendingInvitationsCount === 0}
        className="relative scale-hover transition-transform duration-200" // Added scale-hover for effect
      >
        <Bell className="h-6 w-6 text-foreground/80" /> {/* Adjusted color for better visibility in header */}
        {pendingInvitationsCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
            {pendingInvitationsCount}
          </span>
        )}
        <span className="sr-only">View Invitations</span>
      </Button>

      <InvitationsModal
        isOpen={isViewInvitationsModalOpen}
        onClose={() => setIsViewInvitationsModalOpen(false)}
        currentUserId={currentUserId}
      />
    </>
  );
}
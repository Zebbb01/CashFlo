// src/hooks/financial-management/useInvitations.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PartnershipInvitation, RespondToInvitationPayload, InvitationStatus } from "@/types";
import { ASSET_COLLEAGUES_QUERY_KEY } from "./useAssets"; // Import if needed for invalidation

const USER_INVITATIONS_QUERY_KEY = "userInvitations";

// API function to fetch user invitations
const fetchUserInvitations = async (userId: string, type: 'sent' | 'received' | 'all'): Promise<PartnershipInvitation[]> => {
  if (!userId) {
    throw new Error("User ID is required to fetch invitations.");
  }
  const res = await fetch(`/api/users/${userId}/invitations?type=${type}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `Failed to fetch ${type} invitations`);
  }
  return res.json();
};

// API function to respond to an invitation
const respondToInvitation = async ({ userId, invitationId, payload }: { userId: string; invitationId: string; payload: RespondToInvitationPayload }): Promise<{ message: string; invitation: PartnershipInvitation }> => {
  const res = await fetch(`/api/users/${userId}/invitations/${invitationId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to respond to invitation");
  }
  return res.json();
};

// Custom hook to fetch user invitations
export const useUserInvitations = (userId: string, type: 'sent' | 'received' | 'all' = 'received') => {
  return useQuery<PartnershipInvitation[], Error>({
    queryKey: [USER_INVITATIONS_QUERY_KEY, userId, type],
    queryFn: () => fetchUserInvitations(userId, type),
    enabled: !!userId, // Only run the query if userId is available
  });
};

// Custom hook to respond to an invitation
export const useRespondToInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string; invitation: PartnershipInvitation }, Error, { userId: string; invitationId: string; payload: RespondToInvitationPayload }>({
    mutationFn: respondToInvitation,
    onSuccess: (data, variables) => {
      // Invalidate the user's invitations list to reflect the status change
      queryClient.invalidateQueries({ queryKey: [USER_INVITATIONS_QUERY_KEY, variables.userId, 'received'] });
      queryClient.invalidateQueries({ queryKey: [USER_INVITATIONS_QUERY_KEY, variables.userId, 'sent'] });
      queryClient.invalidateQueries({ queryKey: [USER_INVITATIONS_QUERY_KEY, variables.userId, 'all'] });

      // If accepted, invalidate the asset's colleagues list as a new partnership is formed
      if (variables.payload.action === 'accept' && data.invitation.assetId) {
        queryClient.invalidateQueries({ queryKey: [ASSET_COLLEAGUES_QUERY_KEY, data.invitation.assetId] });
      }
    },
  });
};

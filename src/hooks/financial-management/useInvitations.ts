// src/hooks/financial-management/useInvitations.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PartnershipInvitation, RespondToInvitationPayload, InvitationStatus } from "@/types";
import { ASSET_COLLEAGUES_QUERY_KEY } from "./useAssets"; // This import remains
import {
  fetchUserInvitationsApi,
  respondToInvitationApi
} from "@/lib/api-clients/invitation-api"; // Import API functions

const USER_INVITATIONS_QUERY_KEY = "userInvitations";

// --- Custom Hooks ---

export const useUserInvitations = (userId: string, type: 'sent' | 'received' | 'all' = 'received') => {
  return useQuery<PartnershipInvitation[], Error>({
    queryKey: [USER_INVITATIONS_QUERY_KEY, userId, type],
    queryFn: () => fetchUserInvitationsApi(userId, type), // Use imported API function
    enabled: !!userId,
  });
};

export const useRespondToInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string; invitation: PartnershipInvitation }, Error, { userId: string; invitationId: string; payload: RespondToInvitationPayload }>({
    mutationFn: respondToInvitationApi, // Use imported API function
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [USER_INVITATIONS_QUERY_KEY, variables.userId, 'received'] });
      queryClient.invalidateQueries({ queryKey: [USER_INVITATIONS_QUERY_KEY, variables.userId, 'sent'] });
      queryClient.invalidateQueries({ queryKey: [USER_INVITATIONS_QUERY_KEY, variables.userId, 'all'] });

      if (variables.payload.action === 'accept' && data.invitation.assetId) {
        queryClient.invalidateQueries({ queryKey: [ASSET_COLLEAGUES_QUERY_KEY, data.invitation.assetId] });
      }
    },
  });
};
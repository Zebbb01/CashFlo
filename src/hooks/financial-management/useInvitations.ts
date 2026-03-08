// src/hooks/financial-management/useInvitations.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PartnershipInvitation, RespondToInvitationPayload } from "@/types";
import {
  fetchUserInvitationsApi,
  respondToInvitationApi
} from "@/lib/api-clients/invitation-api";
import { useAppMutation } from "@/hooks/useAppMutation";
import { invitationKeys } from "@/queryKeys/invitationKeys";
import { assetKeys } from "@/queryKeys/assetKeys"; // Import assetKeys

// --- Custom Hooks ---

export const useUserInvitations = (userId: string, type: 'sent' | 'received' | 'all' = 'received') => {
  return useQuery<PartnershipInvitation[], Error>({
    queryKey: invitationKeys.list(userId, type),
    queryFn: () => fetchUserInvitationsApi(userId, type),
    enabled: !!userId,
  });
};

export const useRespondToInvitation = () => {
  const queryClient = useQueryClient();
  return useAppMutation<{ message: string; invitation: PartnershipInvitation }, Error, { userId: string; invitationId: string; payload: RespondToInvitationPayload }>({
    mutationFn: respondToInvitationApi,
    onSuccess: (data, variables) => {
      // Invalidate specific invitation lists for the user
      queryClient.invalidateQueries({ queryKey: invitationKeys.list(variables.userId, 'received') });
      queryClient.invalidateQueries({ queryKey: invitationKeys.list(variables.userId, 'sent') });
      queryClient.invalidateQueries({ queryKey: invitationKeys.list(variables.userId, 'all') });

      if (variables.payload.action === 'accept' && data.invitation.assetId) {
        // Invalidate asset colleagues list if an invitation to a partnership for an asset is accepted
        queryClient.invalidateQueries({ queryKey: assetKeys.partnershipList(data.invitation.assetId) });
      }
    },
  });
};
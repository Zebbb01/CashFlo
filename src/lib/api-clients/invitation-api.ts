// src/lib/api-clients/invitation-api.ts
import { PartnershipInvitation, RespondToInvitationPayload } from "@/types";

const handleApiResponse = async (res: Response, errorMessage: string) => {
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || errorMessage);
  }
  return res.json();
};

export const fetchUserInvitationsApi = async (userId: string, type: 'sent' | 'received' | 'all'): Promise<PartnershipInvitation[]> => {
  if (!userId) {
    throw new Error("User ID is required to fetch invitations.");
  }
  const res = await fetch(`/api/users/${userId}/invitations?type=${type}`);
  return handleApiResponse(res, `Failed to fetch ${type} invitations`);
};

export const respondToInvitationApi = async ({ userId, invitationId, payload }: { userId: string; invitationId: string; payload: RespondToInvitationPayload }): Promise<{ message: string; invitation: PartnershipInvitation }> => {
  const res = await fetch(`/api/users/${userId}/invitations/${invitationId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleApiResponse(res, "Failed to respond to invitation");
};
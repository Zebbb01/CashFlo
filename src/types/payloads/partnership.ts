// src/types/payload/partnership.ts

export interface SendPartnershipInvitationPayload {
    senderId: string;
    receiverId: string;
    sharePercentage: number;
    message?: string | null;
}

export interface UpdateAssetPartnershipPayload {
    sharePercentage?: number;
    isActive?: boolean;
}

export interface RespondToInvitationPayload {
    action: "accept" | "reject";
}
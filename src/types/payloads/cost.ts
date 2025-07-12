// src/types/payload/cost.ts

export interface CreateCostPayload {
  category: string;
  amount: number;
  date?: string;
  description?: string | null;
  bankAssetManagementId: string;
  incurredByUserId?: string | null;
  attributedToUserIds?: string[];
}

export interface UpdateCostPayload {
  category?: string;
  amount?: number;
  date?: string;
  description?: string | null;
  bankAssetManagementId?: string | null;
  userId?: string | null;
}
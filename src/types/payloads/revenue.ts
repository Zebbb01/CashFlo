// src/types/payload/revenue.ts

export interface CreateRevenuePayload {
  source: string;
  amount: number;
  date?: string;
  description?: string | null;
  bankAssetManagementId: string;
  recordedByUserId?: string | null;
}

export interface UpdateRevenuePayload {
  source?: string;
  amount?: number;
  date?: string;
  description?: string | null;
  bankAssetManagementId?: string | null;
  userId?: string | null;
}
// src/types/payload/asset.ts

export interface CreateAssetPayload {
  assetType: string;
  companyId: string;
  assetName: string;
  assetValue?: number | null;
  bankId?: string | null;
  userId?: string | null;
}

export interface UpdateAssetPayload {
  assetType?: string;
  companyId?: string;
  assetName?: string;
  assetValue?: number | null;
  softDelete?: boolean;
  bankId?: string | null;
  userId?: string | null;
}
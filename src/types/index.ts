// src/types/index.ts

export interface Company {
  id: string;
  name: string;
  description: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Asset {
  id: string;
  assetType: string;
  companyId: string;
  assetName: string;
  assetValue: number;
  deletedAt: string | null; // ISO date string or null
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  company?: Company; // Included when fetching assets with company
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  status: number;
  error?: string;
}

export interface ErrorResponse {
  message: string;
}

export interface CreateAssetPayload {
  assetType: string;
  companyId: string;
  assetName: string;
  assetValue: number;
}

export interface UpdateAssetPayload {
  assetType?: string;
  companyId?: string;
  assetName?: string;
  assetValue?: number;
  softDelete?: boolean; // For PATCH
}

export interface CreateCompanyPayload {
  name: string;
  description?: string;
}

export interface UpdateCompanyPayload {
  name?: string;
  description?: string;
}
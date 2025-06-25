// src/types/index.ts

import { AssetManagement } from "@prisma/client";

export interface Company {
  id: string;
  name: string;
  description: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  assets?: AssetManagement[]; // Prisma relation
  revenues?: Revenue[]; // Prisma relation
  costs?: Cost[];     // Prisma relation
}

export interface Asset { // Renamed from AssetManagement to Asset for clarity
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

// New: Revenue Interface
export interface Revenue {
  id: string;
  source: string;
  amount: number;
  date: string; // Assuming ISO date string from backend
  description: string | null;
  companyId: string | null;
  userId: string | null;
  assetId?: string; // New field
  asset?: Asset;    // New field, for including asset details
  company?: Company; // Included when fetching with company
  user?: User; // Included when fetching with user
  createdAt: string;
  updatedAt: string;
}

// New: Cost Interface
export interface Cost {
  id: string;
  category: string;
  amount: number;
  date: string; // Assuming ISO date string from backend
  description: string | null;
  companyId: string | null;
  userId: string | null;
  assetId?: string; // New field
  asset?: Asset;    // New field, for including asset details
  company?: Company; // Included when fetching with company
  user?: User; // Included when fetching with user
  createdAt: string;
  updatedAt: string;
}

// Existing types
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

// New: Payloads for creating Revenue and Cost
export interface CreateRevenuePayload {
  source: string;
  amount: number;
  date?: string; // Optional, defaults to now() in Prisma
  description?: string;
  companyId?: string | null;
  userId?: string | null;
  assetId?: string | null;
}

export interface CreateCostPayload {
  category: string;
  amount: number;
  date?: string; // Optional, defaults to now() in Prisma
  description?: string;
  companyId?: string | null;
  userId?: string | null;
  assetId?: string | null;
}

// Minimal User interface for relationships
export interface User {
  id: string;
  name?: string | null;
  email: string;
}
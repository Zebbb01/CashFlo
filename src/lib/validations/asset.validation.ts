// src/lib/validations/asset.validation.ts
import { z } from 'zod';

export const createAssetSchema = z.object({
  assetType: z.string().min(1, 'Asset type is required'),
  companyId: z.string().min(1, 'Company ID is required'),
  assetName: z.string().min(1, 'Asset name is required'),
  assetValue: z.number().optional(),
  bankId: z.string().optional(),
  userId: z.string().min(1, 'User ID is required'),
});

export const updateAssetSchema = createAssetSchema.partial();

export const partnershipUpdateSchema = z.object({
  sharePercentage: z.number().min(0).max(100).optional(),
  isActive: z.boolean().optional(),
});

export const invitationSchema = z.object({
  receiverId: z.string().min(1, 'Receiver ID is required'),
  sharePercentage: z.number().min(0.01).max(100, 'Share percentage must be between 0.01 and 100'),
  message: z.string().optional(),
});
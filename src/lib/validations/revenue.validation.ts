// src/lib/validations/revenue.validation.ts
import { z } from 'zod';

export const createRevenueSchema = z.object({
  source: z.string().min(1, 'Source is required'),
  amount: z.number().positive('Amount must be a positive number'),
  date: z.string().datetime().optional(), // Date as ISO string
  description: z.string().optional(),
  bankAssetManagementId: z.string().min(1, 'Revenue must be linked to a bank asset management.'),
  recordedByUserId: z.string().min(1, 'User recording revenue is required.'), // Added for clarity
});

// For update, all fields are optional
export const updateRevenueSchema = z.object({
  source: z.string().min(1, 'Source is required').optional(),
  amount: z.number().positive('Amount must be a positive number').optional(),
  date: z.string().datetime().optional(),
  description: z.string().optional(),
  bankAssetManagementId: z.string().min(1, 'Revenue must be linked to a bank asset management.').optional(),
  userId: z.string().min(1, 'User ID is required').optional(), // Corresponds to the 'user' relation for who recorded it
}).partial(); // Make all fields optional for partial updates
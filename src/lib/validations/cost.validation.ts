// src/lib/validations/cost.validation.ts
import { z } from 'zod';

export const createCostSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  amount: z.number().positive('Amount must be a positive number'),
  date: z.string().datetime().optional(), // Date as ISO string
  description: z.string().optional(),
  bankAssetManagementId: z.string().min(1, 'Cost must be linked to a bank asset management.'),
  incurredByUserId: z.string().min(1, 'User incurring cost is required.'), // Added for clarity
  attributedToUserIds: z.array(z.string()).optional(), // Array of user IDs for specific attribution
});

// For update, all fields are optional
export const updateCostSchema = z.object({
  category: z.string().min(1, 'Category is required').optional(),
  amount: z.number().positive('Amount must be a positive number').optional(),
  date: z.string().datetime().optional(),
  description: z.string().optional(),
  bankAssetManagementId: z.string().min(1, 'Cost must be linked to a bank asset management.').optional(),
  userId: z.string().min(1, 'User ID is required').optional(), // Changed from incurredByUserId for updates to be generic
}).partial(); // Make all fields optional for partial updates
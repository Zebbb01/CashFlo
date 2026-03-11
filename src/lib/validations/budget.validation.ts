// src/lib/validations/budget.validation.ts
import { z } from 'zod';

export const createBudgetSchema = z.object({
  name: z.string().min(1, 'Budget name is required'),
  type: z.enum(['REVENUE', 'COST'], { required_error: 'Budget type is required' }),
  category: z.string().min(1, 'Category is required'),
  amount: z.number().positive('Amount must be a positive number'),
  period: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY'], { required_error: 'Period is required' }),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
});

export const updateBudgetSchema = z.object({
  name: z.string().min(1, 'Budget name is required').optional(),
  type: z.enum(['REVENUE', 'COST']).optional(),
  category: z.string().min(1, 'Category is required').optional(),
  amount: z.number().positive('Amount must be a positive number').optional(),
  period: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
}).partial();

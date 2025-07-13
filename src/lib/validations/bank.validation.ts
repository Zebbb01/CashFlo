// src/lib/validations/bank.validation.ts
import { z } from 'zod';

export const createBankSchema = z.object({
  name: z.string().min(1, 'Bank name is required'),
});

export const updateBankSchema = createBankSchema.partial();
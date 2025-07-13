// src/lib/validations/company.validation.ts
import { z } from 'zod';

export const createCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  description: z.string().optional(),
});

export const updateCompanySchema = createCompanySchema.partial();
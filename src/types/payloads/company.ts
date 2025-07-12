// src/types/payload/company.ts

export interface CreateCompanyPayload {
  name: string;
  description?: string | null;
}

export interface UpdateCompanyPayload {
  name?: string;
  description?: string | null;
}
// src/lib/api-clients/company-api.ts
import { Company, CreateCompanyPayload, UpdateCompanyPayload } from "@/types";

const handleApiResponse = async (res: Response, errorMessage: string) => {
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || errorMessage);
  }
  return res.json();
};

export const fetchCompaniesApi = async (): Promise<Company[]> => {
  const res = await fetch("/api/companies");
  return handleApiResponse(res, "Failed to fetch companies");
};

export const fetchCompanyApi = async (id: string): Promise<Company> => {
  const res = await fetch(`/api/companies/${id}`);
  return handleApiResponse(res, "Failed to fetch company");
};

export const createCompanyApi = async (newCompany: CreateCompanyPayload): Promise<Company> => {
  const res = await fetch("/api/companies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCompany),
  });
  return handleApiResponse(res, "Failed to create company");
};

export const updateCompanyApi = async ({ id, payload }: { id: string; payload: UpdateCompanyPayload }): Promise<Company> => {
  const res = await fetch(`/api/companies/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleApiResponse(res, "Failed to update company");
};

export const deleteCompanyApi = async (id: string): Promise<{ message: string }> => {
  const res = await fetch(`/api/companies/${id}`, { method: "DELETE" });
  return handleApiResponse(res, "Failed to delete company");
};
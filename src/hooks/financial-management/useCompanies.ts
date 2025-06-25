// src/hooks/financial-management/useCompanies.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Company, CreateCompanyPayload, UpdateCompanyPayload } from "@/types";

const COMPANY_QUERY_KEY = "companies";

// --- API Functions ---
const fetchCompanies = async (): Promise<Company[]> => {
  const res = await fetch("/api/companies");
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch companies");
  }
  return res.json();
};

const createCompany = async (newCompany: CreateCompanyPayload): Promise<Company> => {
  const res = await fetch("/api/companies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCompany),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to create company");
  }
  return res.json();
};

const updateCompany = async ({ id, payload }: { id: string; payload: UpdateCompanyPayload }): Promise<Company> => {
  const res = await fetch(`/api/companies/${id}`, {
    method: "PUT", // Companies only have PUT for full update
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update company");
  }
  return res.json();
};

const deleteCompany = async (id: string): Promise<{ message: string }> => {
  const res = await fetch(`/api/companies/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to delete company");
  }
  return res.json();
};

// --- Custom Hooks ---

export const useCompanies = () => {
  return useQuery<Company[], Error>({
    queryKey: [COMPANY_QUERY_KEY],
    queryFn: fetchCompanies,
  });
};

export const useCompany = (id: string) => {
  return useQuery<Company, Error>({
    queryKey: [COMPANY_QUERY_KEY, id],
    queryFn: () => fetch(`/api/companies/${id}`).then(res => {
      if (!res.ok) throw new Error("Company not found");
      return res.json();
    }),
    enabled: !!id, // Only run query if ID is available
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation<Company, Error, CreateCompanyPayload>({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMPANY_QUERY_KEY] });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation<Company, Error, { id: string; payload: UpdateCompanyPayload }>({
    mutationFn: updateCompany,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [COMPANY_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [COMPANY_QUERY_KEY, variables.id] });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMPANY_QUERY_KEY] });
    },
  });
};
// src/hooks/financial-management/useCompanies.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Company, CreateCompanyPayload, UpdateCompanyPayload } from "@/types";
import {
  fetchCompaniesApi, fetchCompanyApi,
  createCompanyApi, updateCompanyApi, deleteCompanyApi
} from "@/lib/api-clients/company-api"; // Import API functions

const COMPANY_QUERY_KEY = "companies";

// --- Custom Hooks ---

export const useCompanies = () => {
  return useQuery<Company[], Error>({
    queryKey: [COMPANY_QUERY_KEY],
    queryFn: fetchCompaniesApi, // Use imported API function
  });
};

export const useCompany = (id: string) => {
  return useQuery<Company, Error>({
    queryKey: [COMPANY_QUERY_KEY, id],
    queryFn: () => fetchCompanyApi(id), // Use imported API function
    enabled: !!id,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation<Company, Error, CreateCompanyPayload>({
    mutationFn: createCompanyApi, // Use imported API function
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMPANY_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['revenues'] });
      queryClient.invalidateQueries({ queryKey: ['costs'] });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation<Company, Error, { id: string; payload: UpdateCompanyPayload }>({
    mutationFn: updateCompanyApi, // Use imported API function
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [COMPANY_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [COMPANY_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: ['revenues'] });
      queryClient.invalidateQueries({ queryKey: ['costs'] });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: deleteCompanyApi, // Use imported API function
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMPANY_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['revenues'] });
      queryClient.invalidateQueries({ queryKey: ['costs'] });
    },
  });
};
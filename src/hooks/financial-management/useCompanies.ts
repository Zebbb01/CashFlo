// src/hooks/financial-management/useCompanies.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Company, CreateCompanyPayload, UpdateCompanyPayload } from "@/types";
import {
  fetchCompaniesApi, fetchCompanyApi,
  createCompanyApi, updateCompanyApi, deleteCompanyApi
} from "@/lib/api-clients/company-api";
import { useAppMutation } from "@/hooks/useAppMutation";
import { companyKeys } from "@/queryKeys/companyKeys";
import { invalidateCompanyRelatedQueries, invalidateRevenueCostRelatedQueries } from "@/utils/queryInvalidators"; // Import new invalidator

// --- Custom Hooks ---

export const useCompanies = () => {
  return useQuery<Company[], Error>({
    queryKey: companyKeys.list(),
    queryFn: fetchCompaniesApi,
  });
};

export const useCompany = (id: string) => {
  return useQuery<Company, Error>({
    queryKey: companyKeys.detail(id),
    queryFn: () => fetchCompanyApi(id),
    enabled: !!id,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useAppMutation<Company, Error, CreateCompanyPayload>({
    mutationFn: createCompanyApi,
    onSuccess: () => {
      invalidateCompanyRelatedQueries(queryClient);
      invalidateRevenueCostRelatedQueries(queryClient); // Companies might affect revenues/costs
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useAppMutation<Company, Error, { id: string; payload: UpdateCompanyPayload }>({
    mutationFn: updateCompanyApi,
    onSuccess: (_, variables) => {
      invalidateCompanyRelatedQueries(queryClient, variables.id);
      invalidateRevenueCostRelatedQueries(queryClient); // Companies might affect revenues/costs
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  return useAppMutation<{ message: string }, Error, string>({
    mutationFn: deleteCompanyApi,
    onSuccess: () => {
      invalidateCompanyRelatedQueries(queryClient);
      invalidateRevenueCostRelatedQueries(queryClient); // Companies might affect revenues/costs
    },
  });
};
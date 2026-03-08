// src/hooks/financial-management/useBanks.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Bank, CreateBankPayload, UpdateBankPayload } from '@/types';
import {
  fetchBanksApi,
  createBankApi,
  updateBankApi,
  deleteBankApi
} from '@/lib/api-clients/bank-api';
import { useAppMutation } from "@/hooks/useAppMutation";
import { bankKeys } from "@/queryKeys/bankKeys";
import { invalidateBankRelatedQueries } from "@/utils/queryInvalidators"; // Import new invalidator

// --- Custom Hooks ---

export const useBanks = () => {
  return useQuery<Bank[], Error>({
    queryKey: bankKeys.list(),
    queryFn: fetchBanksApi,
  });
};

export const useCreateBank = () => {
  const queryClient = useQueryClient();
  return useAppMutation<Bank, Error, CreateBankPayload>({
    mutationFn: createBankApi,
    onSuccess: () => {
      invalidateBankRelatedQueries(queryClient);
    },
  });
};

export const useUpdateBank = () => {
  const queryClient = useQueryClient();
  return useAppMutation<Bank, Error, { id: string; payload: UpdateBankPayload }>({
    mutationFn: updateBankApi,
    onSuccess: (_, variables) => {
      invalidateBankRelatedQueries(queryClient, variables.id);
    },
  });
};

export const useDeleteBank = () => {
  const queryClient = useQueryClient();
  return useAppMutation<{ message: string }, Error, string>({
    mutationFn: deleteBankApi,
    onSuccess: () => {
      invalidateBankRelatedQueries(queryClient);
    },
  });
};
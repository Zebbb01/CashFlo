// src/hooks/financial-management/useBanks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bank, CreateBankPayload, UpdateBankPayload } from '@/types';
import {
  fetchBanksApi,
  createBankApi,
  updateBankApi,
  deleteBankApi
} from '@/lib/api-clients/bank-api'; // Import API functions

const BANK_QUERY_KEY = 'banks';

// --- Custom Hooks ---

export const useBanks = () => {
  return useQuery<Bank[], Error>({
    queryKey: [BANK_QUERY_KEY],
    queryFn: fetchBanksApi, // Use imported API function
  });
};

export const useCreateBank = () => {
  const queryClient = useQueryClient();
  return useMutation<Bank, Error, CreateBankPayload>({
    mutationFn: createBankApi, // Use imported API function
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BANK_QUERY_KEY] });
    },
  });
};

export const useUpdateBank = () => {
  const queryClient = useQueryClient();
  return useMutation<Bank, Error, { id: string; payload: UpdateBankPayload }>({
    mutationFn: updateBankApi, // Use imported API function
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [BANK_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [BANK_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
};

export const useDeleteBank = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: deleteBankApi, // Use imported API function
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BANK_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
};
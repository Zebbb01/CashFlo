// src/hooks/financial-management/useBanks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bank, CreateBankPayload, UpdateBankPayload } from '@/types'; // Ensure Bank is imported from your updated types.ts

const BANK_QUERY_KEY = 'banks';

// --- API Functions ---
const fetchBanks = async (): Promise<Bank[]> => {
  const res = await fetch('/api/banks');
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to fetch banks');
  }
  return res.json();
};

const createBank = async (newBank: CreateBankPayload): Promise<Bank> => {
  const res = await fetch('/api/banks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newBank),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to create bank');
  }
  return res.json();
};

const updateBank = async ({ id, payload }: { id: string; payload: UpdateBankPayload }): Promise<Bank> => {
  const res = await fetch(`/api/banks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update bank');
  }
  return res.json();
};

const deleteBank = async (id: string): Promise<{ message: string }> => {
  const res = await fetch(`/api/banks/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete bank');
  }
  return res.json();
};

// --- Custom Hooks ---

export const useBanks = () => {
  return useQuery<Bank[], Error>({
    queryKey: [BANK_QUERY_KEY],
    queryFn: fetchBanks,
  });
};

export const useCreateBank = () => {
  const queryClient = useQueryClient();
  return useMutation<Bank, Error, CreateBankPayload>({
    mutationFn: createBank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BANK_QUERY_KEY] });
    },
  });
};

export const useUpdateBank = () => {
  const queryClient = useQueryClient();
  return useMutation<Bank, Error, { id: string; payload: UpdateBankPayload }>({
    mutationFn: updateBank,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [BANK_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [BANK_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: ['assets'] }); // Invalidate assets as bank changes affect asset relations
      // queryClient.invalidateQueries({ queryKey: ['companies'] }); // Removed, as companies are no longer directly associated with banks
    },
  });
};

export const useDeleteBank = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: deleteBank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BANK_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['assets'] }); // Invalidate assets as bank deletion affects asset relations
      // queryClient.invalidateQueries({ queryKey: ['companies'] }); // Removed, as companies are no longer directly associated with banks
    },
  });
};

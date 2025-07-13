// src/lib/api-clients/bank-api.ts
import { Bank, CreateBankPayload, UpdateBankPayload } from '@/types';

// Helper function for consistent API response handling
const handleApiResponse = async (res: Response, errorMessage: string) => {
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || errorMessage);
  }
  return res.json();
};

export const fetchBanksApi = async (): Promise<Bank[]> => {
  const res = await fetch('/api/banks');
  return handleApiResponse(res, 'Failed to fetch banks');
};

export const createBankApi = async (newBank: CreateBankPayload): Promise<Bank> => {
  const res = await fetch('/api/banks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newBank),
  });
  return handleApiResponse(res, 'Failed to create bank');
};

export const updateBankApi = async ({ id, payload }: { id: string; payload: UpdateBankPayload }): Promise<Bank> => {
  const res = await fetch(`/api/banks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleApiResponse(res, 'Failed to update bank');
};

export const deleteBankApi = async (id: string): Promise<{ message: string }> => {
  const res = await fetch(`/api/banks/${id}`, { method: 'DELETE' });
  return handleApiResponse(res, 'Failed to delete bank');
};
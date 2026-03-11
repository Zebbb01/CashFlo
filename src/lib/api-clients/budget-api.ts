// src/lib/api-clients/budget-api.ts
import type {
  BudgetWithActuals,
  CreateBudgetPayload,
  UpdateBudgetPayload,
} from '@/types/budget';

const handleApiResponse = async (res: Response, errorMessage: string) => {
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || errorData.error || errorMessage);
  }
  return res.json();
};

export const fetchBudgetsApi = async (): Promise<BudgetWithActuals[]> => {
  const res = await fetch('/api/budgets');
  return handleApiResponse(res, 'Failed to fetch budgets');
};

export const fetchBudgetApi = async (id: string): Promise<BudgetWithActuals> => {
  const res = await fetch(`/api/budgets/${id}`);
  return handleApiResponse(res, 'Failed to fetch budget');
};

export const createBudgetApi = async (data: CreateBudgetPayload): Promise<BudgetWithActuals> => {
  const res = await fetch('/api/budgets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleApiResponse(res, 'Failed to create budget');
};

export const updateBudgetApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateBudgetPayload;
}): Promise<BudgetWithActuals> => {
  const res = await fetch(`/api/budgets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleApiResponse(res, 'Failed to update budget');
};

export const deleteBudgetApi = async (id: string): Promise<{ message: string }> => {
  const res = await fetch(`/api/budgets/${id}`, { method: 'DELETE' });
  return handleApiResponse(res, 'Failed to delete budget');
};

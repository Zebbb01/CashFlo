// src/hooks/financial-management/useBudgets.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  BudgetWithActuals,
  CreateBudgetPayload,
  UpdateBudgetPayload,
} from '@/types/budget';
import {
  fetchBudgetsApi,
  fetchBudgetApi,
  createBudgetApi,
  updateBudgetApi,
  deleteBudgetApi,
} from '@/lib/api-clients/budget-api';
import { budgetKeys } from '@/queryKeys/budgetKeys';
import { useAppMutation } from '@/hooks/useAppMutation';

export const useBudgets = () => {
  return useQuery<BudgetWithActuals[], Error>({
    queryKey: budgetKeys.list(),
    queryFn: fetchBudgetsApi,
  });
};

export const useBudget = (id: string) => {
  return useQuery<BudgetWithActuals, Error>({
    queryKey: budgetKeys.detail(id),
    queryFn: () => fetchBudgetApi(id),
    enabled: !!id,
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();
  return useAppMutation<BudgetWithActuals, Error, CreateBudgetPayload>({
    mutationFn: createBudgetApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
    },
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();
  return useAppMutation<BudgetWithActuals, Error, { id: string; payload: UpdateBudgetPayload }>({
    mutationFn: updateBudgetApi,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
    },
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();
  return useAppMutation<{ message: string }, Error, string>({
    mutationFn: deleteBudgetApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
    },
  });
};

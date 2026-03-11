// src/queryKeys/budgetKeys.ts
import { QueryKey } from "@tanstack/react-query";

export const budgetKeys = {
  all: ['budgets'] as const,
  lists: () => [...budgetKeys.all, 'list'] as const,
  list: (): QueryKey => [...budgetKeys.lists()],
  detail: (id: string): QueryKey => [...budgetKeys.all, 'detail', id],
};

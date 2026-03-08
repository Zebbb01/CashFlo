// src/queryKeys/companyKeys.ts
import { QueryKey } from "@tanstack/react-query";

export const companyKeys = {
  all: ['companies'] as const,
  lists: () => [...companyKeys.all, 'list'] as const,
  list: (): QueryKey => [...companyKeys.lists()],
  details: () => [...companyKeys.all, 'detail'] as const,
  detail: (id: string): QueryKey => [...companyKeys.details(), id],
};
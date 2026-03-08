// src/queryKeys/bankKeys.ts
import { QueryKey } from "@tanstack/react-query";

export const bankKeys = {
  all: ['banks'] as const,
  lists: () => [...bankKeys.all, 'list'] as const,
  list: (): QueryKey => [...bankKeys.lists()],
  details: () => [...bankKeys.all, 'detail'] as const,
  detail: (id: string): QueryKey => [...bankKeys.details(), id],
};
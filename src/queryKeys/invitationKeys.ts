// src/queryKeys/invitationKeys.ts
import { QueryKey } from "@tanstack/react-query";

export const invitationKeys = {
  all: ['userInvitations'] as const,
  lists: () => [...invitationKeys.all, 'list'] as const,
  list: (userId: string, type: 'sent' | 'received' | 'all' = 'received'): QueryKey => [...invitationKeys.lists(), userId, type],
};
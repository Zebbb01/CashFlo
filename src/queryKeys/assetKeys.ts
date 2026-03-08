// src/queryKeys/assetKeys.ts
import { QueryKey } from "@tanstack/react-query";

export const assetKeys = {
  all: ['assets'] as const,
  lists: () => [...assetKeys.all, 'list'] as const,
  list: (includeDeleted: boolean): QueryKey => [...assetKeys.lists(), { includeDeleted }],
  details: () => [...assetKeys.all, 'detail'] as const,
  detail: (id: string): QueryKey => [...assetKeys.details(), id],
  partnerships: () => [...assetKeys.all, 'partnerships'] as const,
  partnershipList: (assetId: string): QueryKey => [...assetKeys.partnerships(), assetId, 'list'],
  assetPartnerships: (assetId: string): QueryKey => [...assetKeys.all, 'partnerships', assetId],
  partnershipDetails: (assetId: string, userId: string): QueryKey => [...assetKeys.partnerships(), assetId, userId, 'detail'],
};
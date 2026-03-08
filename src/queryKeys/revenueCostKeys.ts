// src/queryKeys/revenueCostKeys.ts
import { QueryKey } from "@tanstack/react-query";

export const revenueCostKeys = {
  all: ['financial'] as const,
  revenues: () => [...revenueCostKeys.all, 'revenues'] as const,
  revenueList: (): QueryKey => [...revenueCostKeys.revenues(), 'list'],
  revenueDetail: (id: string): QueryKey => [...revenueCostKeys.revenues(), 'detail', id],
  costs: () => [...revenueCostKeys.all, 'costs'] as const,
  costList: (): QueryKey => [...revenueCostKeys.costs(), 'list'],
  costDetail: (id: string): QueryKey => [...revenueCostKeys.costs(), 'detail', id],
  totals: (): QueryKey => [...revenueCostKeys.all, 'totals'],
};

// If assetKeys are also defined here, or if you want to define them here:
export const assetKeys = {
  all: ['assets'] as const,
  lists: () => [...assetKeys.all, 'list'] as const,
  detail: (id: string): QueryKey => [...assetKeys.all, 'detail', id],
  assetPartnerships: (assetId: string): QueryKey => [...assetKeys.all, 'partnerships', assetId],
  partnershipDetails: (assetId: string, userId: string): QueryKey => [...assetKeys.all, 'partnershipDetails', assetId, userId],
  // Ensure partnershipList is also here if it was previously assumed
  partnershipList: (assetId: string): QueryKey => [...assetKeys.all, 'partnershipList', assetId],
};
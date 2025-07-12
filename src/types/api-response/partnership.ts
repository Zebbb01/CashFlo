// src/types/api-response/partnership.ts

import { AssetPartnership, RevenueShare, CostAttribution } from "../prisma/partnership";

export interface AssetPartnershipDetailsResponse {
  partnership: AssetPartnership;
  revenueShares: RevenueShare[];
  costAttributions: CostAttribution[];
  totals: {
    totalRevenueShare: number;
    totalCostAttribution: number;
    netAmount: number;
  };
}
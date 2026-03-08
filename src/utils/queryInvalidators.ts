// src/utils/queryInvalidators.ts
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { assetKeys } from "@/queryKeys/assetKeys";
import { revenueCostKeys } from "@/queryKeys/revenueCostKeys";
import { companyKeys } from "@/queryKeys/companyKeys"; // NEW
import { bankKeys } from "@/queryKeys/bankKeys"; // NEW
import { invitationKeys } from "@/queryKeys/invitationKeys"; // NEW

/**
 * Invalidates common financial queries related to assets, totals, banks, and companies.
 * @param queryClient The QueryClient instance.
 * @param additionalKeys Optional array of additional query keys to invalidate.
 */
export const invalidateCommonFinancialQueries = (queryClient: QueryClient, additionalKeys: QueryKey[] = []) => {
  queryClient.invalidateQueries({ queryKey: assetKeys.lists() });
  queryClient.invalidateQueries({ queryKey: revenueCostKeys.totals() });
  queryClient.invalidateQueries({ queryKey: bankKeys.lists() }); // Use bankKeys
  queryClient.invalidateQueries({ queryKey: companyKeys.lists() }); // Use companyKeys
  additionalKeys.forEach(key => queryClient.invalidateQueries({ queryKey: key }));
};

/**
 * Invalidates asset-specific queries, including asset details, colleagues, and invitations.
 * @param queryClient The QueryClient instance.
 * @param assetId The ID of the asset.
 */
export const invalidateAssetSpecificQueries = (queryClient: QueryClient, assetId: string) => {
  queryClient.invalidateQueries({ queryKey: assetKeys.detail(assetId) });
  queryClient.invalidateQueries({ queryKey: assetKeys.partnershipList(assetId) });
  queryClient.invalidateQueries({ queryKey: invitationKeys.lists() }); // Invalidate all invitations that might be tied to assets
};

/**
 * Invalidates queries related to revenues, costs, totals, assets, and banks.
 * @param queryClient The QueryClient instance.
 */
export const invalidateRevenueCostRelatedQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: revenueCostKeys.revenueList() });
  queryClient.invalidateQueries({ queryKey: revenueCostKeys.costList() });
  queryClient.invalidateQueries({ queryKey: revenueCostKeys.totals() });
  queryClient.invalidateQueries({ queryKey: assetKeys.lists() });
  queryClient.invalidateQueries({ queryKey: bankKeys.lists() }); // Use bankKeys
};

/**
 * Invalidates queries related to companies, revenues, and costs.
 * @param queryClient The QueryClient instance.
 */
export const invalidateCompanyRelatedQueries = (queryClient: QueryClient, companyId?: string) => {
  queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
  if (companyId) {
    queryClient.invalidateQueries({ queryKey: companyKeys.detail(companyId) });
  }
  queryClient.invalidateQueries({ queryKey: revenueCostKeys.revenueList() });
  queryClient.invalidateQueries({ queryKey: revenueCostKeys.costList() });
};

/**
 * Invalidates queries related to banks and assets.
 * @param queryClient The QueryClient instance.
 * @param bankId The ID of the bank.
 */
export const invalidateBankRelatedQueries = (queryClient: QueryClient, bankId?: string) => {
  queryClient.invalidateQueries({ queryKey: bankKeys.lists() });
  if (bankId) {
    queryClient.invalidateQueries({ queryKey: bankKeys.detail(bankId) });
  }
  queryClient.invalidateQueries({ queryKey: assetKeys.lists() });
};
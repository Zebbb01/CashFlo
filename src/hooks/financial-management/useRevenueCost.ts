// src/hooks/financial-management/useRevenueCost.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Revenue, Cost,
  CreateRevenuePayload, UpdateRevenuePayload,
  CreateCostPayload, UpdateCostPayload
} from "@/types";
import {
  fetchRevenuesApi, fetchRevenueApi, createRevenueApi, updateRevenueApi, deleteRevenueApi
} from "@/lib/api-clients/revenue-api";
import {
  fetchCostsApi, fetchCostApi, createCostApi, updateCostApi, deleteCostApi
} from "@/lib/api-clients/cost-api";
import { invalidateRevenueCostRelatedQueries } from "@/utils/queryInvalidators";
import { revenueCostKeys } from "@/queryKeys/revenueCostKeys";
import { assetKeys } from "@/queryKeys/assetKeys"; // Needed for assetColleagueDetails invalidation
import { useAppMutation } from "@/hooks/useAppMutation"; // Import the generic mutation hook
import { useAssets } from "./useAssets";

export const TOTALS_QUERY_KEY = revenueCostKeys.totals()[0]; // Export as a string for use in other files if needed

// --- Custom Hooks for Revenue ---
export const useRevenues = () => {
  return useQuery<Revenue[], Error>({
    queryKey: revenueCostKeys.revenueList(),
    queryFn: fetchRevenuesApi,
  });
};

export const useRevenue = (id: string) => {
  return useQuery<Revenue, Error>({
    queryKey: revenueCostKeys.revenueDetail(id),
    queryFn: () => fetchRevenueApi(id),
    enabled: !!id,
  });
};

export const useCreateRevenue = () => {
  const queryClient = useQueryClient();
  return useAppMutation<Revenue, Error, CreateRevenuePayload>({
    mutationFn: createRevenueApi,
    onSuccess: (newRevenue) => {
      invalidateRevenueCostRelatedQueries(queryClient);
      if (newRevenue.bankAssetManagementId) {
        queryClient.invalidateQueries({ queryKey: assetKeys.partnershipDetails(newRevenue.bankAssetManagementId, 'self') }); // Assuming 'self' or similar for direct bank asset management
      }
      newRevenue.revenueShares?.forEach(share => {
        queryClient.invalidateQueries({ queryKey: assetKeys.partnershipDetails(share.assetId, share.userId) });
      });
    },
  });
};

export const useUpdateRevenue = () => {
  const queryClient = useQueryClient();
  return useAppMutation<Revenue, Error, { id: string; payload: UpdateRevenuePayload }>({
    mutationFn: updateRevenueApi,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: revenueCostKeys.revenueDetail(variables.id) });
      invalidateRevenueCostRelatedQueries(queryClient);
    },
  });
};

export const useDeleteRevenue = () => {
  const queryClient = useQueryClient();
  return useAppMutation<{ message: string }, Error, string>({
    mutationFn: deleteRevenueApi,
    onSuccess: () => {
      invalidateRevenueCostRelatedQueries(queryClient);
    },
  });
};

// --- Custom Hooks for Cost ---
export const useCosts = () => {
  return useQuery<Cost[], Error>({
    queryKey: revenueCostKeys.costList(),
    queryFn: fetchCostsApi,
  });
};

export const useCost = (id: string) => {
  return useQuery<Cost, Error>({
    queryKey: revenueCostKeys.costDetail(id),
    queryFn: () => fetchCostApi(id),
    enabled: !!id,
  });
};

export const useCreateCost = () => {
  const queryClient = useQueryClient();
  return useAppMutation<Cost, Error, CreateCostPayload>({
    mutationFn: createCostApi,
    onSuccess: (newCost) => {
      invalidateRevenueCostRelatedQueries(queryClient);
      if (newCost.bankAssetManagementId) {
        queryClient.invalidateQueries({ queryKey: assetKeys.partnershipDetails(newCost.bankAssetManagementId, 'self') }); // Assuming 'self' or similar
      }
      newCost.costAttributions?.forEach(attribution => {
        queryClient.invalidateQueries({ queryKey: assetKeys.partnershipDetails(attribution.assetId, attribution.userId) });
      });
    },
  });
};

export const useUpdateCost = () => {
  const queryClient = useQueryClient();
  return useAppMutation<Cost, Error, { id: string; payload: UpdateCostPayload }>({
    mutationFn: updateCostApi,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: revenueCostKeys.costDetail(variables.id) });
      invalidateRevenueCostRelatedQueries(queryClient);
    },
  });
};

export const useDeleteCost = () => {
  const queryClient = useQueryClient();
  return useAppMutation<{ message: string }, Error, string>({
    mutationFn: deleteCostApi,
    onSuccess: () => {
      invalidateRevenueCostRelatedQueries(queryClient);
    },
  });
};

// --- Combined Hook for Totals ---
export const useFinancialTotals = () => {
  const { data: assets, isLoading: isLoadingAssets, error: assetsError } = useAssets();
  const { data: revenues, isLoading: isLoadingRevenues, error: revenuesError } = useRevenues();
  const { data: costs, isLoading: isLoadingCosts, error: costsError } = useCosts();

  const totalAssets = assets?.reduce((sum, asset) => sum + (asset.assetValue ?? 0), 0) || 0;
  const totalRevenue = revenues?.reduce((sum, revenue) => sum + revenue.amount, 0) || 0;
  const totalCosting = costs?.reduce((sum, cost) => sum + cost.amount, 0) || 0;
  const netProfit = totalRevenue - totalCosting;

  return {
    totalAssets,
    totalRevenue,
    totalCosting,
    netProfit,
    isLoading: isLoadingAssets || isLoadingRevenues || isLoadingCosts,
    error: assetsError || revenuesError || costsError,
  };
};
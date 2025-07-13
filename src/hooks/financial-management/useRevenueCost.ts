// src/hooks/financial-management/useRevenueCost.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Revenue, Cost,
  CreateRevenuePayload, UpdateRevenuePayload,
  CreateCostPayload, UpdateCostPayload
} from "@/types";
import { useAssets } from "./useAssets"; // This import remains

import {
  fetchRevenuesApi, fetchRevenueApi, createRevenueApi, updateRevenueApi, deleteRevenueApi
} from "@/lib/api-clients/revenue-api"; // Import Revenue API functions
import {
  fetchCostsApi, fetchCostApi, createCostApi, updateCostApi, deleteCostApi
} from "@/lib/api-clients/cost-api"; // Import Cost API functions

const REVENUE_QUERY_KEY = "revenues";
const COST_QUERY_KEY = "costs";
export const TOTALS_QUERY_KEY = "financialTotals";

// --- Custom Hooks for Revenue ---
export const useRevenues = () => {
  return useQuery<Revenue[], Error>({
    queryKey: [REVENUE_QUERY_KEY],
    queryFn: fetchRevenuesApi, // Use imported API function
  });
};

export const useRevenue = (id: string) => {
  return useQuery<Revenue, Error>({
    queryKey: [REVENUE_QUERY_KEY, id],
    queryFn: () => fetchRevenueApi(id), // Use imported API function
    enabled: !!id,
  });
};

export const useCreateRevenue = () => {
  const queryClient = useQueryClient();
  return useMutation<Revenue, Error, CreateRevenuePayload>({
    mutationFn: createRevenueApi, // Use imported API function
    onSuccess: (newRevenue) => {
      queryClient.invalidateQueries({ queryKey: [REVENUE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      if (newRevenue.bankAssetManagementId) {
        queryClient.invalidateQueries({ queryKey: ['assetColleagueDetails', newRevenue.bankAssetManagementId] });
      }
      newRevenue.revenueShares?.forEach(share => {
        queryClient.invalidateQueries({ queryKey: ['assetColleagueDetails', share.assetId, share.userId] });
      });
    },
  });
};

export const useUpdateRevenue = () => {
  const queryClient = useQueryClient();
  return useMutation<Revenue, Error, { id: string; payload: UpdateRevenuePayload }>({
    mutationFn: updateRevenueApi, // Use imported API function
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [REVENUE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [REVENUE_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
    },
  });
};

export const useDeleteRevenue = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: deleteRevenueApi, // Use imported API function
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REVENUE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
    },
  });
};

// --- Custom Hooks for Cost ---
export const useCosts = () => {
  return useQuery<Cost[], Error>({
    queryKey: [COST_QUERY_KEY],
    queryFn: fetchCostsApi, // Use imported API function
  });
};

export const useCost = (id: string) => {
  return useQuery<Cost, Error>({
    queryKey: [COST_QUERY_KEY, id],
    queryFn: () => fetchCostApi(id), // Use imported API function
    enabled: !!id,
  });
};

export const useCreateCost = () => {
  const queryClient = useQueryClient();
  return useMutation<Cost, Error, CreateCostPayload>({
    mutationFn: createCostApi, // Use imported API function
    onSuccess: (newCost) => {
      queryClient.invalidateQueries({ queryKey: [COST_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      if (newCost.bankAssetManagementId) {
        queryClient.invalidateQueries({ queryKey: ['assetColleagueDetails', newCost.bankAssetManagementId] });
      }
      newCost.costAttributions?.forEach(attribution => {
        queryClient.invalidateQueries({ queryKey: ['assetColleagueDetails', attribution.assetId, attribution.userId] });
      });
    },
  });
};

export const useUpdateCost = () => {
  const queryClient = useQueryClient();
  return useMutation<Cost, Error, { id: string; payload: UpdateCostPayload }>({
    mutationFn: updateCostApi, // Use imported API function
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [COST_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [COST_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
    },
  });
};

export const useDeleteCost = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: deleteCostApi, // Use imported API function
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COST_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
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
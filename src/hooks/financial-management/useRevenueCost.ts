// src/hooks/financial-management/useRevenueCost.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Revenue, Cost,
  CreateRevenuePayload, UpdateRevenuePayload,
  CreateCostPayload, UpdateCostPayload
} from "@/types"; // Ensure these types are correctly defined based on the new schema
import { useAssets } from "./useAssets";

const REVENUE_QUERY_KEY = "revenues";
const COST_QUERY_KEY = "costs";
export const TOTALS_QUERY_KEY = "financialTotals";

// --- API Functions for Revenue ---
const fetchRevenues = async (): Promise<Revenue[]> => {
  const res = await fetch("/api/revenues");
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch revenues");
  }
  return res.json();
};

const fetchRevenue = async (id: string): Promise<Revenue> => {
  const res = await fetch(`/api/revenues/${id}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch revenue");
  }
  return res.json();
};

const createRevenue = async (newRevenue: CreateRevenuePayload): Promise<Revenue> => {
  const res = await fetch("/api/revenues", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newRevenue),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to create revenue");
  }
  return res.json();
};

const updateRevenue = async ({ id, payload }: { id: string; payload: UpdateRevenuePayload }): Promise<Revenue> => {
  const res = await fetch(`/api/revenues/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update revenue");
  }
  return res.json();
};

const deleteRevenue = async (id: string): Promise<{ message: string }> => {
  const res = await fetch(`/api/revenues/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to delete revenue");
  }
  return res.json();
};

// --- API Functions for Cost ---
const fetchCosts = async (): Promise<Cost[]> => {
  const res = await fetch("/api/costs");
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch costs");
  }
  return res.json();
};

const fetchCost = async (id: string): Promise<Cost> => {
  const res = await fetch(`/api/costs/${id}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch cost");
  }
  return res.json();
};

const createCost = async (newCost: CreateCostPayload): Promise<Cost> => {
  const res = await fetch("/api/costs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCost),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to create cost");
  }
  return res.json();
};

const updateCost = async ({ id, payload }: { id: string; payload: UpdateCostPayload }): Promise<Cost> => {
  const res = await fetch(`/api/costs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update cost");
  }
  return res.json();
};

const deleteCost = async (id: string): Promise<{ message: string }> => {
  const res = await fetch(`/api/costs/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to delete cost");
  }
  return res.json();
};


// --- Custom Hooks for Revenue ---
export const useRevenues = () => {
  return useQuery<Revenue[], Error>({
    queryKey: [REVENUE_QUERY_KEY],
    queryFn: fetchRevenues,
  });
};

export const useRevenue = (id: string) => {
  return useQuery<Revenue, Error>({
    queryKey: [REVENUE_QUERY_KEY, id],
    queryFn: () => fetchRevenue(id),
    enabled: !!id,
  });
};

export const useCreateRevenue = () => {
  const queryClient = useQueryClient();
  return useMutation<Revenue, Error, CreateRevenuePayload>({
    mutationFn: createRevenue,
    onSuccess: (newRevenue) => {
      queryClient.invalidateQueries({ queryKey: [REVENUE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['assets'] }); // Invalidate assets as new revenue affects asset totals
      queryClient.invalidateQueries({ queryKey: ['banks'] }); // Invalidate banks as new revenue affects bank totals (via assets)
      // NEW: Invalidate asset-specific colleague details if revenue shares are created
      if (newRevenue.bankAssetManagementId) {
        queryClient.invalidateQueries({ queryKey: ['assetColleagueDetails', newRevenue.bankAssetManagementId] });
      }
      // NEW: Invalidate specific user's partnership details if they received a share
      newRevenue.revenueShares?.forEach(share => {
        queryClient.invalidateQueries({ queryKey: ['assetColleagueDetails', share.assetId, share.userId] });
      });
    },
  });
};

export const useUpdateRevenue = () => {
  const queryClient = useQueryClient();
  return useMutation<Revenue, Error, { id: string; payload: UpdateRevenuePayload }>({
    mutationFn: updateRevenue,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [REVENUE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [REVENUE_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      // NOTE: Updating revenue amount via PUT does NOT automatically update RevenueShares.
      // If you need that, you'd need to implement a recalculation logic in the API
      // and then invalidate specific 'assetColleagueDetails' queries here.
    },
  });
};

export const useDeleteRevenue = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: deleteRevenue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REVENUE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      // NOTE: Deleting revenue does NOT automatically delete RevenueShares or update totals in partnership details.
      // A more robust solution might involve soft-deleting revenue and its shares,
      // or re-calculating partnership totals upon revenue deletion.
    },
  });
};

// --- Custom Hooks for Cost ---
export const useCosts = () => {
  return useQuery<Cost[], Error>({
    queryKey: [COST_QUERY_KEY],
    queryFn: fetchCosts,
  });
};

export const useCost = (id: string) => {
  return useQuery<Cost, Error>({
    queryKey: [COST_QUERY_KEY, id],
    queryFn: () => fetchCost(id),
    enabled: !!id,
  });
};

export const useCreateCost = () => {
  const queryClient = useQueryClient();
  return useMutation<Cost, Error, CreateCostPayload>({
    mutationFn: createCost,
    onSuccess: (newCost) => {
      queryClient.invalidateQueries({ queryKey: [COST_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      // NEW: Invalidate asset-specific colleague details if cost attributions are created
      if (newCost.bankAssetManagementId) {
        queryClient.invalidateQueries({ queryKey: ['assetColleagueDetails', newCost.bankAssetManagementId] });
      }
      // NEW: Invalidate specific user's partnership details if they received an attribution
      newCost.costAttributions?.forEach(attribution => {
        queryClient.invalidateQueries({ queryKey: ['assetColleagueDetails', attribution.assetId, attribution.userId] });
      });
    },
  });
};

export const useUpdateCost = () => {
  const queryClient = useQueryClient();
  return useMutation<Cost, Error, { id: string; payload: UpdateCostPayload }>({
    mutationFn: updateCost,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [COST_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [COST_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      // NOTE: Updating cost amount via PUT does NOT automatically update CostAttributions.
      // If you need that, you'd need to implement a recalculation logic in the API
      // and then invalidate specific 'assetColleagueDetails' queries here.
    },
  });
};

export const useDeleteCost = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: deleteCost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COST_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      // NOTE: Deleting cost does NOT automatically delete CostAttributions or update totals in partnership details.
      // A more robust solution might involve soft-deleting cost and its attributions,
      // or re-calculating partnership totals upon cost deletion.
    },
  });
};


// --- Combined Hook for Totals ---
export const useFinancialTotals = () => {
  const { data: assets, isLoading: isLoadingAssets, error: assetsError } = useAssets();
  const { data: revenues, isLoading: isLoadingRevenues, error: revenuesError } = useRevenues();
  const { data: costs, isLoading: isLoadingCosts, error: costsError } = useCosts();

  // Handle assetValue being null or undefined
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

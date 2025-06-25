// src/hooks/financial-management/useRevenueCost.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Revenue, Cost, CreateRevenuePayload, CreateCostPayload } from "@/types";
import { useAssets } from "./useAssets"; // Ensure this import is here for useFinancialTotals

const REVENUE_QUERY_KEY = "revenues";
const COST_QUERY_KEY = "costs";
export const TOTALS_QUERY_KEY = "financialTotals";

// --- API Functions for Revenue ---
const fetchRevenues = async (): Promise<Revenue[]> => {
  const res = await fetch("/api/revenue"); // Make sure this API route returns assets and company
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch revenues");
  }
  return res.json();
};

const fetchRevenue = async (id: string): Promise<Revenue> => { // NEW
  const res = await fetch(`/api/revenue/${id}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch revenue");
  }
  return res.json();
};

const createRevenue = async (newRevenue: CreateRevenuePayload): Promise<Revenue> => {
  const res = await fetch("/api/revenue", {
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

const updateRevenue = async ({ id, payload }: { id: string; payload: Partial<CreateRevenuePayload> }): Promise<Revenue> => { // NEW
  const res = await fetch(`/api/revenue/${id}`, {
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

const deleteRevenue = async (id: string): Promise<{ message: string }> => { // NEW
  const res = await fetch(`/api/revenue/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to delete revenue");
  }
  return res.json();
};

// --- API Functions for Cost ---
const fetchCosts = async (): Promise<Cost[]> => {
  const res = await fetch("/api/costs"); // Make sure this API route returns assets and company
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch costs");
  }
  return res.json();
};

const fetchCost = async (id: string): Promise<Cost> => { // NEW
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

const updateCost = async ({ id, payload }: { id: string; payload: Partial<CreateCostPayload> }): Promise<Cost> => { // NEW
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

const deleteCost = async (id: string): Promise<{ message: string }> => { // NEW
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

export const useRevenue = (id: string) => { // NEW
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REVENUE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
    },
  });
};

export const useUpdateRevenue = () => { // NEW
  const queryClient = useQueryClient();
  return useMutation<Revenue, Error, { id: string; payload: Partial<CreateRevenuePayload> }>({
    mutationFn: updateRevenue,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [REVENUE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [REVENUE_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
    },
  });
};

export const useDeleteRevenue = () => { // NEW
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: deleteRevenue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REVENUE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
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

export const useCost = (id: string) => { // NEW
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COST_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
    },
  });
};

export const useUpdateCost = () => { // NEW
  const queryClient = useQueryClient();
  return useMutation<Cost, Error, { id: string; payload: Partial<CreateCostPayload> }>({
    mutationFn: updateCost,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [COST_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [COST_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
    },
  });
};

export const useDeleteCost = () => { // NEW
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: deleteCost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COST_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
    },
  });
};


// --- Combined Hook for Totals ---
export const useFinancialTotals = () => {
  const { data: assets, isLoading: isLoadingAssets, error: assetsError } = useAssets();
  const { data: revenues, isLoading: isLoadingRevenues, error: revenuesError } = useRevenues();
  const { data: costs, isLoading: isLoadingCosts, error: costsError } = useCosts();

  const totalAssets = assets?.reduce((sum, asset) => sum + asset.assetValue, 0) || 0;
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
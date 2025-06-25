// src/hooks/financial-management/useAssets.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Asset, CreateAssetPayload, UpdateAssetPayload } from "@/types";
import { TOTALS_QUERY_KEY } from "./useRevenueCost";

const ASSET_QUERY_KEY = "assets";

// --- API Functions ---
const fetchAssets = async (includeDeleted: boolean = false): Promise<Asset[]> => {
  const params = new URLSearchParams();
  if (includeDeleted) {
    params.append("includeDeleted", "true");
  }
  const res = await fetch(`/api/asset-management?${params.toString()}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch assets");
  }
  return res.json();
};

const createAsset = async (newAsset: CreateAssetPayload): Promise<Asset> => {
  const res = await fetch("/api/asset-management", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newAsset),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to create asset");
  }
  return res.json();
};

const updateAsset = async ({ id, payload }: { id: string; payload: UpdateAssetPayload }): Promise<Asset> => {
  const method = payload.softDelete !== undefined ? "PATCH" : "PUT"; // Determine method based on payload
  const res = await fetch(`/api/asset-management/${id}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update asset");
  }
  return res.json();
};

const deleteAsset = async (id: string): Promise<{ message: string }> => {
  const res = await fetch(`/api/asset-management/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to delete asset");
  }
  return res.json();
};

// --- Custom Hooks ---

export const useAssets = (includeDeleted: boolean = false) => {
  return useQuery<Asset[], Error>({
    queryKey: [ASSET_QUERY_KEY, { includeDeleted }],
    queryFn: () => fetchAssets(includeDeleted),
  });
};

export const useAsset = (id: string) => {
  return useQuery<Asset, Error>({
    queryKey: [ASSET_QUERY_KEY, id],
    queryFn: () => fetch(`/api/asset-management/${id}`).then(res => {
      if (!res.ok) throw new Error("Asset not found");
      return res.json();
    }),
    enabled: !!id, // Only run query if ID is available
  });
};

export const useCreateAsset = () => {
  const queryClient = useQueryClient();
  return useMutation<Asset, Error, CreateAssetPayload>({
    mutationFn: createAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ASSET_QUERY_KEY] }); // Invalidate to refetch all assets
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] }); // Invalidate totals on new asset
    },
  });
};

export const useUpdateAsset = () => {
  const queryClient = useQueryClient();
  return useMutation<Asset, Error, { id: string; payload: UpdateAssetPayload }>({
    mutationFn: updateAsset,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [ASSET_QUERY_KEY] }); // Invalidate all assets
      queryClient.invalidateQueries({ queryKey: [ASSET_QUERY_KEY, variables.id] }); // Invalidate specific asset
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] }); // Invalidate totals on asset update
    },
  });
};

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: deleteAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ASSET_QUERY_KEY] }); // Invalidate to refetch all assets
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] }); // Invalidate totals on asset delete
    },
  });
};
// src/hooks/financial-management/useAssets.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Asset, CreateAssetPayload, UpdateAssetPayload,
  AssetPartnership, AssetPartnershipDetailsResponse, AssetColleaguesResponse,
  SendPartnershipInvitationPayload, UpdateAssetPartnershipPayload
} from "@/types";
import { TOTALS_QUERY_KEY } from "./useRevenueCost"; // Ensure this path is correct

const ASSET_QUERY_KEY = "assets";
export const ASSET_COLLEAGUES_QUERY_KEY = "assetColleagues"; // Exported
export const ASSET_COLLEAGUE_DETAILS_QUERY_KEY = "assetColleagueDetails"; // Exported

// --- API Functions for Asset Management ---
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

// --- API Functions for Asset Colleagues (Partnerships) ---

// GET /api/asset-management/[id]/colleagues
const fetchAssetPartnerships = async (assetId: string): Promise<AssetColleaguesResponse> => {
  const res = await fetch(`/api/asset-management/${assetId}/colleagues`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch asset partnerships");
  }
  return res.json();
};

// GET /api/asset-management/[id]/colleagues/[userId]
const fetchAssetPartnershipDetails = async ({ assetId, userId }: { assetId: string; userId: string }): Promise<AssetPartnershipDetailsResponse> => {
  const res = await fetch(`/api/asset-management/${assetId}/colleagues/${userId}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch asset partnership details");
  }
  return res.json();
};

// POST /api/asset-management/[id]/colleagues (Send Invitation)
const sendPartnershipInvitation = async ({ assetId, payload }: { assetId: string; payload: SendPartnershipInvitationPayload }): Promise<{ message: string; invitation: any }> => {
  const res = await fetch(`/api/asset-management/${assetId}/colleagues`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to send partnership invitation");
  }
  return res.json();
};

// PUT /api/asset-management/[id]/colleagues/[userId] (Update Partnership)
const updateAssetPartnership = async ({ assetId, userId, payload }: { assetId: string; userId: string; payload: UpdateAssetPartnershipPayload }): Promise<{ message: string; partnership: AssetPartnership }> => {
  const res = await fetch(`/api/asset-management/${assetId}/colleagues/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update partnership");
  }
  return res.json();
};

// DELETE /api/asset-management/[id]/colleagues/[userId] (Deactivate Partnership)
const deactivateAssetPartnership = async ({ assetId, userId }: { assetId: string; userId: string }): Promise<{ message: string }> => {
  const res = await fetch(`/api/asset-management/${assetId}/colleagues/${userId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to deactivate partnership");
  }
  return res.json();
};


// --- Custom Hooks for Asset Management ---

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
    onSuccess: (newAsset) => {
      queryClient.invalidateQueries({ queryKey: [ASSET_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      // If a new asset is created, its colleagues list might be affected
      queryClient.invalidateQueries({ queryKey: [ASSET_COLLEAGUES_QUERY_KEY, newAsset.id] });
    },
  });
};

export const useUpdateAsset = () => {
  const queryClient = useQueryClient();
  return useMutation<Asset, Error, { id: string; payload: UpdateAssetPayload }>({
    mutationFn: updateAsset,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [ASSET_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ASSET_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      // Invalidate asset's colleagues list if its properties change that might affect partnerships
      queryClient.invalidateQueries({ queryKey: [ASSET_COLLEAGUES_QUERY_KEY, variables.id] });
    },
  });
};

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: deleteAsset,
    onSuccess: (data, assetId) => {
      queryClient.invalidateQueries({ queryKey: [ASSET_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      // Invalidate all queries related to this asset's colleagues and invitations
      queryClient.invalidateQueries({ queryKey: [ASSET_COLLEAGUES_QUERY_KEY, assetId] });
      queryClient.invalidateQueries({ queryKey: [ASSET_COLLEAGUE_DETAILS_QUERY_KEY, assetId] });
      queryClient.invalidateQueries({ queryKey: ['userInvitations'] }); // Might affect invitations if asset is deleted
    },
  });
};

// --- Custom Hooks for Asset Colleagues (Partnerships) ---

export const useAssetPartnerships = (assetId: string) => {
  return useQuery<AssetColleaguesResponse, Error>({
    queryKey: [ASSET_COLLEAGUES_QUERY_KEY, assetId],
    queryFn: () => fetchAssetPartnerships(assetId),
    enabled: !!assetId,
  });
};

export const useAssetPartnershipDetails = (assetId: string, userId: string) => {
  return useQuery<AssetPartnershipDetailsResponse, Error>({
    queryKey: [ASSET_COLLEAGUE_DETAILS_QUERY_KEY, assetId, userId],
    queryFn: () => fetchAssetPartnershipDetails({ assetId, userId }),
    enabled: !!assetId && !!userId,
  });
};

export const useSendPartnershipInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string; invitation: any }, Error, { assetId: string; payload: SendPartnershipInvitationPayload }>({
    mutationFn: sendPartnershipInvitation,
    onSuccess: (data, variables) => {
      // Invalidate the asset's colleagues list (to show pending invitations if API returns them, or just refresh)
      queryClient.invalidateQueries({ queryKey: [ASSET_COLLEAGUES_QUERY_KEY, variables.assetId] });
      // Invalidate the receiver's invitations list
      queryClient.invalidateQueries({ queryKey: ['userInvitations', variables.payload.receiverId] });
    },
  });
};

export const useUpdateAssetPartnership = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string; partnership: AssetPartnership }, Error, { assetId: string; userId: string; payload: UpdateAssetPartnershipPayload }>({
    mutationFn: updateAssetPartnership,
    onSuccess: (data, variables) => {
      // Invalidate the specific partnership details
      queryClient.invalidateQueries({ queryKey: [ASSET_COLLEAGUE_DETAILS_QUERY_KEY, variables.assetId, variables.userId] });
      // Invalidate the overall asset colleagues list
      queryClient.invalidateQueries({ queryKey: [ASSET_COLLEAGUES_QUERY_KEY, variables.assetId] });
      // Invalidate financial totals as share percentage changes might affect future calculations
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['revenues'] }); // Invalidate revenues/costs if their display depends on current shares
      queryClient.invalidateQueries({ queryKey: ['costs'] });
    },
  });
};

export const useDeactivateAssetPartnership = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, { assetId: string; userId: string }>({
    mutationFn: deactivateAssetPartnership,
    onSuccess: (data, variables) => {
      // Invalidate the specific partnership details
      queryClient.invalidateQueries({ queryKey: [ASSET_COLLEAGUE_DETAILS_QUERY_KEY, variables.assetId, variables.userId] });
      // Invalidate the overall asset colleagues list
      queryClient.invalidateQueries({ queryKey: [ASSET_COLLEAGUES_QUERY_KEY, variables.assetId] });
      // Invalidate financial totals as deactivation affects future calculations
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['revenues'] });
      queryClient.invalidateQueries({ queryKey: ['costs'] });
    },
  });
};

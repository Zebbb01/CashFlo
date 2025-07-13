// src/hooks/financial-management/useAssets.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Asset, CreateAssetPayload, UpdateAssetPayload,
  AssetPartnership, AssetPartnershipDetailsResponse, AssetColleaguesResponse,
  SendPartnershipInvitationPayload, UpdateAssetPartnershipPayload
} from "@/types";
import { TOTALS_QUERY_KEY } from "./useRevenueCost";
import {
  fetchAssetsApi, fetchAssetApi, createAssetApi, updateAssetApi, deleteAssetApi,
  fetchAssetPartnershipsApi, fetchAssetPartnershipDetailsApi,
  sendPartnershipInvitationApi, updateAssetPartnershipApi, deactivateAssetPartnershipApi
} from "@/lib/api-clients/asset-api"; // Import API functions

const ASSET_QUERY_KEY = "assets";
export const ASSET_COLLEAGUES_QUERY_KEY = "assetColleagues";
export const ASSET_COLLEAGUE_DETAILS_QUERY_KEY = "assetColleagueDetails";

// --- Custom Hooks for Asset Management ---

export const useAssets = (includeDeleted: boolean = false) => {
  return useQuery<Asset[], Error>({
    queryKey: [ASSET_QUERY_KEY, { includeDeleted }],
    queryFn: () => fetchAssetsApi(includeDeleted), // Use imported API function
  });
};

export const useAsset = (id: string) => {
  return useQuery<Asset, Error>({
    queryKey: [ASSET_QUERY_KEY, id],
    queryFn: () => fetchAssetApi(id), // Use imported API function
    enabled: !!id,
  });
};

export const useCreateAsset = () => {
  const queryClient = useQueryClient();
  return useMutation<Asset, Error, CreateAssetPayload>({
    mutationFn: createAssetApi, // Use imported API function
    onSuccess: (newAsset) => {
      queryClient.invalidateQueries({ queryKey: [ASSET_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: [ASSET_COLLEAGUES_QUERY_KEY, newAsset.id] });
    },
  });
};

export const useUpdateAsset = () => {
  const queryClient = useQueryClient();
  return useMutation<Asset, Error, { id: string; payload: UpdateAssetPayload }>({
    mutationFn: updateAssetApi, // Use imported API function
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [ASSET_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ASSET_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: [ASSET_COLLEAGUES_QUERY_KEY, variables.id] });
    },
  });
};

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: deleteAssetApi, // Use imported API function
    onSuccess: (data, assetId) => {
      queryClient.invalidateQueries({ queryKey: [ASSET_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: [ASSET_COLLEAGUES_QUERY_KEY, assetId] });
      queryClient.invalidateQueries({ queryKey: [ASSET_COLLEAGUE_DETAILS_QUERY_KEY, assetId] });
      queryClient.invalidateQueries({ queryKey: ['userInvitations'] });
    },
  });
};

// --- Custom Hooks for Asset Colleagues (Partnerships) ---

export const useAssetPartnerships = (assetId: string) => {
  return useQuery<AssetColleaguesResponse, Error>({
    queryKey: [ASSET_COLLEAGUES_QUERY_KEY, assetId],
    queryFn: () => fetchAssetPartnershipsApi(assetId), // Use imported API function
    enabled: !!assetId,
  });
};

export const useAssetPartnershipDetails = (assetId: string, userId: string) => {
  return useQuery<AssetPartnershipDetailsResponse, Error>({
    queryKey: [ASSET_COLLEAGUE_DETAILS_QUERY_KEY, assetId, userId],
    queryFn: () => fetchAssetPartnershipDetailsApi({ assetId, userId }), // Use imported API function
    enabled: !!assetId && !!userId,
  });
};

export const useSendPartnershipInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string; invitation: any }, Error, { assetId: string; payload: SendPartnershipInvitationPayload }>({
    mutationFn: sendPartnershipInvitationApi, // Use imported API function
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ASSET_COLLEAGUES_QUERY_KEY, variables.assetId] });
      queryClient.invalidateQueries({ queryKey: ['userInvitations', variables.payload.receiverId] });
    },
  });
};

export const useUpdateAssetPartnership = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string; partnership: AssetPartnership }, Error, { assetId: string; userId: string; payload: UpdateAssetPartnershipPayload }>({
    mutationFn: updateAssetPartnershipApi, // Use imported API function
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ASSET_COLLEAGUE_DETAILS_QUERY_KEY, variables.assetId, variables.userId] });
      queryClient.invalidateQueries({ queryKey: [ASSET_COLLEAGUES_QUERY_KEY, variables.assetId] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['revenues'] });
      queryClient.invalidateQueries({ queryKey: ['costs'] });
    },
  });
};

export const useDeactivateAssetPartnership = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, { assetId: string; userId: string }>({
    mutationFn: deactivateAssetPartnershipApi, // Use imported API function
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ASSET_COLLEAGUE_DETAILS_QUERY_KEY, variables.assetId, variables.userId] });
      queryClient.invalidateQueries({ queryKey: [ASSET_COLLEAGUES_QUERY_KEY, variables.assetId] });
      queryClient.invalidateQueries({ queryKey: [TOTALS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['revenues'] });
      queryClient.invalidateQueries({ queryKey: ['costs'] });
    },
  });
};
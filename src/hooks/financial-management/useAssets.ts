// src/hooks/financial-management/useAssets.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Asset, CreateAssetPayload, UpdateAssetPayload,
  AssetPartnership, AssetPartnershipDetailsResponse, AssetColleaguesResponse,
  SendPartnershipInvitationPayload, UpdateAssetPartnershipPayload
} from "@/types";
import {
  fetchAssetsApi, fetchAssetApi, createAssetApi, updateAssetApi, deleteAssetApi,
  fetchAssetPartnershipsApi, fetchAssetPartnershipDetailsApi,
  sendPartnershipInvitationApi, updateAssetPartnershipApi, deactivateAssetPartnershipApi
} from "@/lib/api-clients/asset-api";
import { invalidateCommonFinancialQueries, invalidateAssetSpecificQueries, invalidateRevenueCostRelatedQueries } from "@/utils/queryInvalidators";
import { assetKeys } from "@/queryKeys/assetKeys";
import { useAppMutation } from "@/hooks/useAppMutation"; // Import the generic mutation hook

// --- Custom Hooks for Asset Management ---

export const useAssets = (includeDeleted: boolean = false) => {
  return useQuery<Asset[], Error>({
    queryKey: assetKeys.list(includeDeleted),
    queryFn: () => fetchAssetsApi(includeDeleted),
  });
};

export const useAsset = (id: string) => {
  return useQuery<Asset, Error>({
    queryKey: assetKeys.detail(id),
    queryFn: () => fetchAssetApi(id),
    enabled: !!id,
  });
};

export const useCreateAsset = () => {
  const queryClient = useQueryClient();
  return useAppMutation<Asset, Error, CreateAssetPayload>({
    mutationFn: createAssetApi,
    onSuccess: (newAsset) => {
      invalidateCommonFinancialQueries(queryClient, [assetKeys.partnershipList(newAsset.id)]);
      // Specific invalidation for new asset colleagues list if needed.
    },
  });
};

export const useUpdateAsset = () => {
  const queryClient = useQueryClient();
  return useAppMutation<Asset, Error, { id: string; payload: UpdateAssetPayload }>({
    mutationFn: updateAssetApi,
    onSuccess: (_, variables) => {
      invalidateCommonFinancialQueries(queryClient);
      invalidateAssetSpecificQueries(queryClient, variables.id);
    },
  });
};

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();
  return useAppMutation<{ message: string }, Error, string>({
    mutationFn: deleteAssetApi,
    onSuccess: (data, assetId) => {
      invalidateCommonFinancialQueries(queryClient);
      invalidateAssetSpecificQueries(queryClient, assetId);
    },
  });
};

// --- Custom Hooks for Asset Colleagues (Partnerships) ---

export const useAssetPartnerships = (assetId: string) => {
  return useQuery<AssetColleaguesResponse, Error>({
    queryKey: assetKeys.partnershipList(assetId),
    queryFn: () => fetchAssetPartnershipsApi(assetId),
    enabled: !!assetId,
  });
};

export const useAssetPartnershipDetails = (assetId: string, userId: string) => {
  return useQuery<AssetPartnershipDetailsResponse, Error>({
    queryKey: assetKeys.partnershipDetails(assetId, userId),
    queryFn: () => fetchAssetPartnershipDetailsApi({ assetId, userId }),
    enabled: !!assetId && !!userId,
  });
};

export const useSendPartnershipInvitation = () => {
  const queryClient = useQueryClient();
  return useAppMutation<{ message: string; invitation: any }, Error, { assetId: string; payload: SendPartnershipInvitationPayload }>({
    mutationFn: sendPartnershipInvitationApi,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: assetKeys.partnershipList(variables.assetId) });
      queryClient.invalidateQueries({ queryKey: ['userInvitations', variables.payload.receiverId] });
    },
  });
};

export const useUpdateAssetPartnership = () => {
  const queryClient = useQueryClient();
  return useAppMutation<{ message: string; partnership: AssetPartnership }, Error, { assetId: string; userId: string; payload: UpdateAssetPartnershipPayload }>({
    mutationFn: updateAssetPartnershipApi,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: assetKeys.partnershipDetails(variables.assetId, variables.userId) });
      queryClient.invalidateQueries({ queryKey: assetKeys.partnershipList(variables.assetId) });
      invalidateRevenueCostRelatedQueries(queryClient);
    },
  });
};

export const useDeactivateAssetPartnership = () => {
  const queryClient = useQueryClient();
  return useAppMutation<{ message: string }, Error, { assetId: string; userId: string }>({
    mutationFn: deactivateAssetPartnershipApi,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: assetKeys.partnershipDetails(variables.assetId, variables.userId) });
      queryClient.invalidateQueries({ queryKey: assetKeys.partnershipList(variables.assetId) });
      invalidateRevenueCostRelatedQueries(queryClient);
    },
  });
};
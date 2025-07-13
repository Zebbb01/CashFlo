// src/lib/api-clients/asset-api.ts
import {
  Asset, CreateAssetPayload, UpdateAssetPayload,
  AssetPartnership, AssetPartnershipDetailsResponse, AssetColleaguesResponse,
  SendPartnershipInvitationPayload, UpdateAssetPartnershipPayload
} from "@/types";

// Helper function to handle common fetch logic and error parsing
const handleApiResponse = async (res: Response, errorMessage: string) => {
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || errorMessage);
  }
  return res.json();
};

// --- API Functions for Asset Management ---

export const fetchAssetsApi = async (includeDeleted: boolean = false): Promise<Asset[]> => {
  const params = new URLSearchParams();
  if (includeDeleted) {
    params.append("includeDeleted", "true");
  }
  const res = await fetch(`/api/asset-management?${params.toString()}`);
  return handleApiResponse(res, "Failed to fetch assets");
};

export const fetchAssetApi = async (id: string): Promise<Asset> => {
  const res = await fetch(`/api/asset-management/${id}`);
  return handleApiResponse(res, "Failed to fetch asset");
};

export const createAssetApi = async (newAsset: CreateAssetPayload): Promise<Asset> => {
  const res = await fetch("/api/asset-management", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newAsset),
  });
  return handleApiResponse(res, "Failed to create asset");
};

export const updateAssetApi = async ({ id, payload }: { id: string; payload: UpdateAssetPayload }): Promise<Asset> => {
  const method = payload.softDelete !== undefined ? "PATCH" : "PUT";
  const res = await fetch(`/api/asset-management/${id}`, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleApiResponse(res, "Failed to update asset");
};

export const deleteAssetApi = async (id: string): Promise<{ message: string }> => {
  const res = await fetch(`/api/asset-management/${id}`, { method: "DELETE" });
  return handleApiResponse(res, "Failed to delete asset");
};

// --- API Functions for Asset Colleagues (Partnerships) ---

export const fetchAssetPartnershipsApi = async (assetId: string): Promise<AssetColleaguesResponse> => {
  const res = await fetch(`/api/asset-management/${assetId}/colleagues`);
  return handleApiResponse(res, "Failed to fetch asset partnerships");
};

export const fetchAssetPartnershipDetailsApi = async ({ assetId, userId }: { assetId: string; userId: string }): Promise<AssetPartnershipDetailsResponse> => {
  const res = await fetch(`/api/asset-management/${assetId}/colleagues/${userId}`);
  return handleApiResponse(res, "Failed to fetch asset partnership details");
};

export const sendPartnershipInvitationApi = async ({ assetId, payload }: { assetId: string; payload: SendPartnershipInvitationPayload }): Promise<{ message: string; invitation: any }> => {
  const res = await fetch(`/api/asset-management/${assetId}/colleagues`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleApiResponse(res, "Failed to send partnership invitation");
};

export const updateAssetPartnershipApi = async ({ assetId, userId, payload }: { assetId: string; userId: string; payload: UpdateAssetPartnershipPayload }): Promise<{ message: string; partnership: AssetPartnership }> => {
  const res = await fetch(`/api/asset-management/${assetId}/colleagues/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleApiResponse(res, "Failed to update partnership");
};

export const deactivateAssetPartnershipApi = async ({ assetId, userId }: { assetId: string; userId: string }): Promise<{ message: string }> => {
  const res = await fetch(`/api/asset-management/${assetId}/colleagues/${userId}`, { method: "DELETE" });
  return handleApiResponse(res, "Failed to deactivate partnership");
};
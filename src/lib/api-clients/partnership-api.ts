// src/lib/api-clients/partnership-api.ts
import { AssetPartnership } from "@/types"; // Ensure you import AssetPartnership type

const BASE_URL = "/api/asset-management"; // Base URL for asset-related APIs

export const fetchAssetPartnershipsByAssetApi = async (assetId: string): Promise<AssetPartnership[]> => {
  if (!assetId) {
    throw new Error("Asset ID is required to fetch asset partnerships.");
  }
  const response = await fetch(`${BASE_URL}/${assetId}/colleagues`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch asset partnerships.");
  }

  const data = await response.json();
  // The backend route returns an object with 'partnerships' array
  return data.partnerships;
};
// src/hooks/financial-management/usePartnership.ts
import { useQuery } from "@tanstack/react-query";
import { AssetPartnership } from "@/types";
// This import statement is correct assuming the export in partnership-api.ts is also correct
import { fetchAssetPartnershipsByAssetApi } from "@/lib/api-clients/partnership-api"; 
import { assetKeys } from "@/queryKeys/assetKeys"; 

export const useAssetPartnershipsByAsset = (assetId: string) => {
  return useQuery<AssetPartnership[], Error>({
    queryKey: assetKeys.assetPartnerships(assetId),
    queryFn: () => fetchAssetPartnershipsByAssetApi(assetId),
    enabled: !!assetId, 
  });
};
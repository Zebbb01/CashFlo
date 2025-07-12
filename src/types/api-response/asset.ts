// src/types/api-response/asset.ts

import { Company } from "../prisma/company";
import { Bank } from "../prisma/bank";

// Assuming AssetColleaguesResponse's asset detail is a subset of the main Asset type
export interface AssetColleaguesResponse {
  asset: {
    id: string;
    name: string;
    type: string;
    company?: Company;
    bank?: Bank;
    ownerId: string;
  };
  // You might want to import AssetPartnership from src/types/prisma/partnership if it's the full type
  // For now, assuming you want the detailed one from prisma
  partnerships: any[]; // Consider defining a specific type for the partnerships here if it's a simplified version
  totalAllocated: number;
  availablePercentage: number;
}
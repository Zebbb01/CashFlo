// src/types/prisma/cost.ts

import { Cost as PrismaCost } from "@prisma/client";
import { Asset } from "./asset";
import { User } from "./user";
import { CostAttribution } from "./partnership"; // CostAttribution is related to Cost

export interface Cost extends PrismaCost {
  bankAssetManagement?: Asset | null;
  user?: User | null;
  costAttributions?: CostAttribution[];
}
// src/types/prisma/partnership.ts

import {
  AssetPartnership as PrismaAssetPartnership,
  PartnershipInvitation as PrismaPartnershipInvitation,
  RevenueShare as PrismaRevenueShare,
  CostAttribution as PrismaCostAttribution,
} from "@prisma/client";
import { Asset } from "./asset";
import { User } from "./user";
import { Revenue } from "./revenue";
import { Cost } from "./cost";

export interface AssetPartnership extends PrismaAssetPartnership {
  asset?: Asset;
  user?: User;
}

export interface PartnershipInvitation extends PrismaPartnershipInvitation {
  asset?: Asset;
  sender?: User;
  receiver?: User;
}

export interface RevenueShare extends PrismaRevenueShare {
  revenue?: Revenue;
  asset?: Asset;
  user?: User;
}

export interface CostAttribution extends PrismaCostAttribution {
  cost?: Cost;
  asset?: Asset;
  user?: User;
}
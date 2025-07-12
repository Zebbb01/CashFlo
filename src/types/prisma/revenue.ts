// src/types/prisma/revenue.ts

import { Revenue as PrismaRevenue } from "@prisma/client";
import { Asset } from "./asset";
import { User } from "./user";
import { RevenueShare } from "./partnership"; // RevenueShare is related to Revenue

export interface Revenue extends PrismaRevenue {
  bankAssetManagement?: Asset | null;
  user?: User | null;
  revenueShares?: RevenueShare[];
}
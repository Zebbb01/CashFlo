// src/types/prisma/asset.ts

import { AssetManagement, AssetManagement as PrismaAssetManagement } from "@prisma/client";
import { Company } from "./company";
import { Bank } from "./bank";
import { User } from "./user";
import { Revenue } from "./revenue";
import { Cost } from "./cost";
import { AssetPartnership, PartnershipInvitation } from "./partnership";

export interface Asset extends PrismaAssetManagement {
  company?: Company;
  bank?: Bank;
  ownerId?: AssetManagement | null;
  owner?: User | null;
  revenuesForBank?: Revenue[];
  costsForBank?: Cost[];
  partnerships?: AssetPartnership[];
  invitations?: PartnershipInvitation[];
}
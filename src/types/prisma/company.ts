// src/types/prisma/company.ts

import { Company as PrismaCompany } from "@prisma/client";
import { Asset } from "./asset";

export interface Company extends PrismaCompany {
  assets?: Asset[]; // Use your Asset type for nested relations
}
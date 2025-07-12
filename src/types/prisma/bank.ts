// src/types/prisma/bank.ts

import { Bank as PrismaBank } from "@prisma/client";
import { Asset } from "./asset"; // Import Asset to avoid circular dependency in index.ts

export interface Bank extends PrismaBank {
  overallSavings?: number; // Calculated by the backend
  assets?: Asset[]; // Optional: for including related assets
}
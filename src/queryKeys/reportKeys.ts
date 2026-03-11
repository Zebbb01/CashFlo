// src/queryKeys/reportKeys.ts
import { QueryKey } from "@tanstack/react-query";

export const reportKeys = {
  all: ['reports'] as const,
  pnl: (startDate?: string, endDate?: string): QueryKey =>
    [...reportKeys.all, 'pnl', startDate || 'all', endDate || 'all'],
  cashflow: (startDate?: string, endDate?: string): QueryKey =>
    [...reportKeys.all, 'cashflow', startDate || 'all', endDate || 'all'],
  balancesheet: (): QueryKey =>
    [...reportKeys.all, 'balancesheet'],
};

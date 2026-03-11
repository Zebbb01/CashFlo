// src/types/report.ts

// --- Profit & Loss Report ---
export type PnlLineItem = {
  label: string;
  amount: number;
  count: number;
};

export type ProfitAndLossReport = {
  startDate: string;
  endDate: string;
  revenueItems: PnlLineItem[];
  costItems: PnlLineItem[];
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
};

// --- Cash Flow Report ---
export type CashFlowMonth = {
  month: string; // e.g., "2026-03"
  label: string; // e.g., "Mar 2026"
  inflow: number;
  outflow: number;
  net: number;
  runningBalance: number;
};

export type CashFlowReport = {
  startDate: string;
  endDate: string;
  months: CashFlowMonth[];
  totalInflow: number;
  totalOutflow: number;
  totalNet: number;
};

// --- Balance Sheet Report ---
export type BalanceSheetAsset = {
  id: string;
  name: string;
  type: string;
  company: string;
  value: number;
};

export type BalanceSheetReport = {
  generatedAt: string;
  assets: BalanceSheetAsset[];
  totalAssets: number;
  totalRevenue: number;
  totalCosts: number;
  netEquity: number;
};

// --- Report API Request ---
export type ReportType = 'pnl' | 'cashflow' | 'balancesheet';

export type ReportParams = {
  type: ReportType;
  startDate?: string;
  endDate?: string;
};

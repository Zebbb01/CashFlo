// src/lib/api-clients/report-api.ts
import {
  ProfitAndLossReport,
  CashFlowReport,
  BalanceSheetReport,
} from '@/types/report';

const handleApiResponse = async (res: Response, errorMessage: string) => {
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || errorData.error || errorMessage);
  }
  return res.json();
};

const buildReportUrl = (type: string, startDate?: string, endDate?: string) => {
  const params = new URLSearchParams({ type });
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);
  return `/api/reports?${params.toString()}`;
};

export const fetchPnlReportApi = async (
  startDate?: string,
  endDate?: string
): Promise<ProfitAndLossReport> => {
  const res = await fetch(buildReportUrl('pnl', startDate, endDate));
  return handleApiResponse(res, 'Failed to fetch Profit & Loss report');
};

export const fetchCashFlowReportApi = async (
  startDate?: string,
  endDate?: string
): Promise<CashFlowReport> => {
  const res = await fetch(buildReportUrl('cashflow', startDate, endDate));
  return handleApiResponse(res, 'Failed to fetch Cash Flow report');
};

export const fetchBalanceSheetReportApi = async (): Promise<BalanceSheetReport> => {
  const res = await fetch(buildReportUrl('balancesheet'));
  return handleApiResponse(res, 'Failed to fetch Balance Sheet report');
};

// src/hooks/financial-management/useReports.ts
import { useQuery } from '@tanstack/react-query';
import {
  ProfitAndLossReport,
  CashFlowReport,
  BalanceSheetReport,
} from '@/types/report';
import {
  fetchPnlReportApi,
  fetchCashFlowReportApi,
  fetchBalanceSheetReportApi,
} from '@/lib/api-clients/report-api';
import { reportKeys } from '@/queryKeys/reportKeys';

export const usePnlReport = (startDate?: string, endDate?: string) => {
  return useQuery<ProfitAndLossReport, Error>({
    queryKey: reportKeys.pnl(startDate, endDate),
    queryFn: () => fetchPnlReportApi(startDate, endDate),
  });
};

export const useCashFlowReport = (startDate?: string, endDate?: string) => {
  return useQuery<CashFlowReport, Error>({
    queryKey: reportKeys.cashflow(startDate, endDate),
    queryFn: () => fetchCashFlowReportApi(startDate, endDate),
  });
};

export const useBalanceSheetReport = () => {
  return useQuery<BalanceSheetReport, Error>({
    queryKey: reportKeys.balancesheet(),
    queryFn: fetchBalanceSheetReportApi,
  });
};

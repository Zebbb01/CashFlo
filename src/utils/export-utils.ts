// src/utils/export-utils.ts
import { formatNumber } from '@/lib/formatters';
import type { ProfitAndLossReport, CashFlowReport, BalanceSheetReport } from '@/types/report';

/**
 * Convert an array of rows to CSV string.
 */
function arrayToCsv(headers: string[], rows: string[][]): string {
  const escape = (val: string) => {
    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const lines = [
    headers.map(escape).join(','),
    ...rows.map((row) => row.map(escape).join(',')),
  ];

  return lines.join('\n');
}

/**
 * Trigger a browser download of a CSV file.
 */
function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export Profit & Loss report to CSV.
 */
export function exportPnlToCsv(report: ProfitAndLossReport) {
  const headers = ['Category', 'Type', 'Amount', 'Entries'];
  const rows: string[][] = [];

  // Revenue section
  report.revenueItems.forEach((item) => {
    rows.push([item.label, 'Revenue', formatNumber(item.amount), item.count.toString()]);
  });
  rows.push(['Total Revenue', '', formatNumber(report.totalRevenue), '']);

  // Separator
  rows.push(['', '', '', '']);

  // Cost section
  report.costItems.forEach((item) => {
    rows.push([item.label, 'Cost', formatNumber(item.amount), item.count.toString()]);
  });
  rows.push(['Total Costs', '', formatNumber(report.totalCosts), '']);

  // Separator
  rows.push(['', '', '', '']);

  // Net Profit
  rows.push(['Net Profit', '', formatNumber(report.netProfit), '']);

  const dateRange = report.startDate && report.endDate
    ? `_${report.startDate.split('T')[0]}_to_${report.endDate.split('T')[0]}`
    : '_all_time';

  downloadCsv(arrayToCsv(headers, rows), `profit_and_loss${dateRange}.csv`);
}

/**
 * Export Cash Flow report to CSV.
 */
export function exportCashFlowToCsv(report: CashFlowReport) {
  const headers = ['Month', 'Inflow', 'Outflow', 'Net', 'Running Balance'];
  const rows: string[][] = [];

  report.months.forEach((month) => {
    rows.push([
      month.label,
      formatNumber(month.inflow),
      formatNumber(month.outflow),
      formatNumber(month.net),
      formatNumber(month.runningBalance),
    ]);
  });

  // Total row
  rows.push(['', '', '', '', '']);
  rows.push([
    'Total',
    formatNumber(report.totalInflow),
    formatNumber(report.totalOutflow),
    formatNumber(report.totalNet),
    '',
  ]);

  const dateRange = report.startDate && report.endDate
    ? `_${report.startDate.split('T')[0]}_to_${report.endDate.split('T')[0]}`
    : '_all_time';

  downloadCsv(arrayToCsv(headers, rows), `cash_flow${dateRange}.csv`);
}

/**
 * Export Balance Sheet report to CSV.
 */
export function exportBalanceSheetToCsv(report: BalanceSheetReport) {
  const headers = ['Item', 'Type', 'Company', 'Value'];
  const rows: string[][] = [];

  // Assets section
  report.assets.forEach((asset) => {
    rows.push([asset.name, asset.type, asset.company, formatNumber(asset.value)]);
  });

  rows.push(['', '', '', '']);
  rows.push(['Total Assets', '', '', formatNumber(report.totalAssets)]);
  rows.push(['Total Revenue (All Time)', '', '', formatNumber(report.totalRevenue)]);
  rows.push(['Total Costs (All Time)', '', '', formatNumber(report.totalCosts)]);
  rows.push(['Net Equity', '', '', formatNumber(report.netEquity)]);

  const date = report.generatedAt.split('T')[0];
  downloadCsv(arrayToCsv(headers, rows), `balance_sheet_${date}.csv`);
}

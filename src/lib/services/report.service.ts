// src/lib/services/report.service.ts
import { prisma } from '@/lib/prisma';
import {
  ProfitAndLossReport,
  PnlLineItem,
  CashFlowReport,
  CashFlowMonth,
  BalanceSheetReport,
  BalanceSheetAsset,
} from '@/types/report';

export class ReportService {
  /**
   * Generate a Profit & Loss report for a given user within a date range.
   * Groups revenues by source and costs by category.
   */
  static async getProfitAndLoss(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<ProfitAndLossReport> {
    const dateFilter: any = {};
    if (startDate) dateFilter.gte = startDate;
    if (endDate) dateFilter.lte = endDate;

    const dateWhere = Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {};

    // Fetch all revenues for this user within date range
    const revenues = await prisma.revenue.findMany({
      where: {
        ...dateWhere,
        OR: [
          { userId },
          { revenueShares: { some: { userId } } },
        ],
      },
      select: {
        source: true,
        amount: true,
      },
    });

    // Fetch all costs for this user within date range
    const costs = await prisma.cost.findMany({
      where: {
        ...dateWhere,
        OR: [
          { userId },
          { costAttributions: { some: { userId } } },
        ],
      },
      select: {
        category: true,
        amount: true,
      },
    });

    // Group revenues by source
    const revenueMap = new Map<string, { amount: number; count: number }>();
    revenues.forEach((rev) => {
      const existing = revenueMap.get(rev.source) || { amount: 0, count: 0 };
      existing.amount += rev.amount;
      existing.count += 1;
      revenueMap.set(rev.source, existing);
    });

    const revenueItems: PnlLineItem[] = Array.from(revenueMap.entries())
      .map(([label, data]) => ({ label, amount: data.amount, count: data.count }))
      .sort((a, b) => b.amount - a.amount);

    // Group costs by category
    const costMap = new Map<string, { amount: number; count: number }>();
    costs.forEach((cost) => {
      const existing = costMap.get(cost.category) || { amount: 0, count: 0 };
      existing.amount += cost.amount;
      existing.count += 1;
      costMap.set(cost.category, existing);
    });

    const costItems: PnlLineItem[] = Array.from(costMap.entries())
      .map(([label, data]) => ({ label, amount: data.amount, count: data.count }))
      .sort((a, b) => b.amount - a.amount);

    const totalRevenue = revenueItems.reduce((sum, item) => sum + item.amount, 0);
    const totalCosts = costItems.reduce((sum, item) => sum + item.amount, 0);

    return {
      startDate: startDate?.toISOString() || '',
      endDate: endDate?.toISOString() || '',
      revenueItems,
      costItems,
      totalRevenue,
      totalCosts,
      netProfit: totalRevenue - totalCosts,
    };
  }

  /**
   * Generate a Cash Flow report grouped by month.
   * Shows monthly inflows (revenue) and outflows (costs) with running balance.
   */
  static async getCashFlow(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<CashFlowReport> {
    const dateFilter: any = {};
    if (startDate) dateFilter.gte = startDate;
    if (endDate) dateFilter.lte = endDate;

    const dateWhere = Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {};

    const revenues = await prisma.revenue.findMany({
      where: {
        ...dateWhere,
        OR: [
          { userId },
          { revenueShares: { some: { userId } } },
        ],
      },
      select: { amount: true, date: true },
      orderBy: { date: 'asc' },
    });

    const costs = await prisma.cost.findMany({
      where: {
        ...dateWhere,
        OR: [
          { userId },
          { costAttributions: { some: { userId } } },
        ],
      },
      select: { amount: true, date: true },
      orderBy: { date: 'asc' },
    });

    // Create a map of year-month to inflow/outflow
    const monthMap = new Map<string, { inflow: number; outflow: number }>();

    const getMonthKey = (date: Date) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    };

    const getMonthLabel = (key: string) => {
      const [year, month] = key.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    revenues.forEach((rev) => {
      const key = getMonthKey(rev.date);
      const existing = monthMap.get(key) || { inflow: 0, outflow: 0 };
      existing.inflow += rev.amount;
      monthMap.set(key, existing);
    });

    costs.forEach((cost) => {
      const key = getMonthKey(cost.date);
      const existing = monthMap.get(key) || { inflow: 0, outflow: 0 };
      existing.outflow += cost.amount;
      monthMap.set(key, existing);
    });

    // Sort by month key and build running balance
    const sortedKeys = Array.from(monthMap.keys()).sort();
    let runningBalance = 0;

    const months: CashFlowMonth[] = sortedKeys.map((key) => {
      const data = monthMap.get(key)!;
      const net = data.inflow - data.outflow;
      runningBalance += net;
      return {
        month: key,
        label: getMonthLabel(key),
        inflow: data.inflow,
        outflow: data.outflow,
        net,
        runningBalance,
      };
    });

    const totalInflow = months.reduce((sum, m) => sum + m.inflow, 0);
    const totalOutflow = months.reduce((sum, m) => sum + m.outflow, 0);

    return {
      startDate: startDate?.toISOString() || '',
      endDate: endDate?.toISOString() || '',
      months,
      totalInflow,
      totalOutflow,
      totalNet: totalInflow - totalOutflow,
    };
  }

  /**
   * Generate a Balance Sheet snapshot.
   * Shows current assets and calculated equity from all-time revenue minus costs.
   */
  static async getBalanceSheet(userId: string): Promise<BalanceSheetReport> {
    // Fetch all non-deleted assets owned by or partnered with this user
    const assets = await prisma.assetManagement.findMany({
      where: {
        deletedAt: null,
        OR: [
          { userId },
          { partnerships: { some: { userId, isActive: true } } },
        ],
      },
      include: {
        company: { select: { name: true } },
      },
      orderBy: { assetValue: 'desc' },
    });

    const balanceSheetAssets: BalanceSheetAsset[] = assets.map((asset) => ({
      id: asset.id,
      name: asset.assetName,
      type: asset.assetType,
      company: asset.company?.name || 'Personal',
      value: asset.assetValue || 0,
    }));

    const totalAssets = balanceSheetAssets.reduce((sum, a) => sum + a.value, 0);

    // Get all-time revenue and cost totals
    const revenueAgg = await prisma.revenue.aggregate({
      _sum: { amount: true },
      where: {
        OR: [
          { userId },
          { revenueShares: { some: { userId } } },
        ],
      },
    });

    const costAgg = await prisma.cost.aggregate({
      _sum: { amount: true },
      where: {
        OR: [
          { userId },
          { costAttributions: { some: { userId } } },
        ],
      },
    });

    const totalRevenue = revenueAgg._sum.amount || 0;
    const totalCosts = costAgg._sum.amount || 0;

    return {
      generatedAt: new Date().toISOString(),
      assets: balanceSheetAssets,
      totalAssets,
      totalRevenue,
      totalCosts,
      netEquity: totalAssets + totalRevenue - totalCosts,
    };
  }
}

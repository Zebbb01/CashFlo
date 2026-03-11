// src/components/financial-management/reports/ProfitLossReport.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePnlReport } from "@/hooks/financial-management/useReports";
import { formatCurrency } from "@/lib/formatters";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

type Props = {
  startDate?: string;
  endDate?: string;
};

export function ProfitLossReport({ startDate, endDate }: Props) {
  const { data: report, isLoading, error } = usePnlReport(startDate, endDate);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} glass>
            <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
            <CardContent className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex justify-between"><Skeleton className="h-4 w-40" /><Skeleton className="h-4 w-24" /></div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card glass>
        <CardContent className="py-8">
          <p className="text-red-400 text-center">Failed to load report: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!report) return null;

  const isProfit = report.netProfit >= 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card glass hover className="fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
            <p className="text-2xl font-bold text-green-500 tracking-tight tabular-nums">
              {formatCurrency(report.totalRevenue)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {report.revenueItems.length} revenue {report.revenueItems.length === 1 ? 'source' : 'sources'}
            </p>
          </CardContent>
        </Card>

        <Card glass hover className="fade-in fade-in-delay-1">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-red-500/10">
                <TrendingDown className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-sm text-muted-foreground">Total Costs</p>
            </div>
            <p className="text-2xl font-bold text-red-500 tracking-tight tabular-nums">
              {formatCurrency(report.totalCosts)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {report.costItems.length} cost {report.costItems.length === 1 ? 'category' : 'categories'}
            </p>
          </CardContent>
        </Card>

        <Card glass hover className="fade-in fade-in-delay-2">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg" style={{ background: isProfit ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }}>
                <DollarSign className={`h-5 w-5 ${isProfit ? 'text-green-500' : 'text-red-500'}`} />
              </div>
              <p className="text-sm text-muted-foreground">Net Profit</p>
            </div>
            <p className={`text-2xl font-bold tracking-tight tabular-nums ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(report.netProfit)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {isProfit ? 'Positive margin' : 'Negative margin'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <Card glass className="fade-in fade-in-delay-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Revenue Breakdown
          </CardTitle>
          <CardDescription>Revenue grouped by source</CardDescription>
        </CardHeader>
        <CardContent>
          {report.revenueItems.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No revenue entries found for the selected period
            </div>
          ) : (
            <div className="space-y-1">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="col-span-6">Source</div>
                <div className="col-span-3 text-right">Amount</div>
                <div className="col-span-3 text-right">Entries</div>
              </div>
              {/* Rows */}
              {report.revenueItems.map((item, index) => (
                <div
                  key={item.label}
                  className="grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-muted/30 transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="col-span-6 font-medium">{item.label}</div>
                  <div className="col-span-3 text-right font-semibold text-green-500 tabular-nums">
                    {formatCurrency(item.amount)}
                  </div>
                  <div className="col-span-3 text-right text-muted-foreground tabular-nums">
                    {item.count}
                  </div>
                </div>
              ))}
              {/* Total Row */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 border-t border-border/40 mt-2 font-bold">
                <div className="col-span-6">Total Revenue</div>
                <div className="col-span-3 text-right text-green-500 tabular-nums">
                  {formatCurrency(report.totalRevenue)}
                </div>
                <div className="col-span-3 text-right text-muted-foreground tabular-nums">
                  {report.revenueItems.reduce((sum, i) => sum + i.count, 0)}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cost Breakdown */}
      <Card glass className="fade-in fade-in-delay-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-500" />
            Cost Breakdown
          </CardTitle>
          <CardDescription>Costs grouped by category</CardDescription>
        </CardHeader>
        <CardContent>
          {report.costItems.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No cost entries found for the selected period
            </div>
          ) : (
            <div className="space-y-1">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="col-span-6">Category</div>
                <div className="col-span-3 text-right">Amount</div>
                <div className="col-span-3 text-right">Entries</div>
              </div>
              {/* Rows */}
              {report.costItems.map((item, index) => (
                <div
                  key={item.label}
                  className="grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-muted/30 transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="col-span-6 font-medium">{item.label}</div>
                  <div className="col-span-3 text-right font-semibold text-red-500 tabular-nums">
                    {formatCurrency(item.amount)}
                  </div>
                  <div className="col-span-3 text-right text-muted-foreground tabular-nums">
                    {item.count}
                  </div>
                </div>
              ))}
              {/* Total Row */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 border-t border-border/40 mt-2 font-bold">
                <div className="col-span-6">Total Costs</div>
                <div className="col-span-3 text-right text-red-500 tabular-nums">
                  {formatCurrency(report.totalCosts)}
                </div>
                <div className="col-span-3 text-right text-muted-foreground tabular-nums">
                  {report.costItems.reduce((sum, i) => sum + i.count, 0)}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Net Profit Summary */}
      <Card glass hover className="fade-in fade-in-delay-3">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Net Profit / Loss</p>
              <p className={`text-3xl font-bold tracking-tight tabular-nums ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(report.netProfit)}
              </p>
            </div>
            <div className={`p-4 rounded-2xl ${isProfit ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              {isProfit ? (
                <TrendingUp className="h-8 w-8 text-green-500" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-500" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

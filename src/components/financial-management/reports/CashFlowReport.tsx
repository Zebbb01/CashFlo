// src/components/financial-management/reports/CashFlowReport.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCashFlowReport } from "@/hooks/financial-management/useReports";
import { formatCurrency } from "@/lib/formatters";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

type Props = {
  startDate?: string;
  endDate?: string;
};

export function CashFlowReport({ startDate, endDate }: Props) {
  const { data: report, isLoading, error } = useCashFlowReport(startDate, endDate);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[250px] w-full rounded-xl" />
        <Card glass>
          <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
          <CardContent className="space-y-3">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="flex justify-between"><Skeleton className="h-4 w-28" /><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-20" /></div>
            ))}
          </CardContent>
        </Card>
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

  const chartData = report.months.map((m) => ({
    month: m.label,
    inflow: m.inflow,
    outflow: m.outflow,
    net: m.net,
    balance: m.runningBalance,
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card glass hover className="fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/10">
                <ArrowUpRight className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground">Total Inflow</p>
            </div>
            <p className="text-2xl font-bold text-green-500 tracking-tight tabular-nums">
              {formatCurrency(report.totalInflow)}
            </p>
          </CardContent>
        </Card>

        <Card glass hover className="fade-in fade-in-delay-1">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-red-500/10">
                <ArrowDownRight className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-sm text-muted-foreground">Total Outflow</p>
            </div>
            <p className="text-2xl font-bold text-red-500 tracking-tight tabular-nums">
              {formatCurrency(report.totalOutflow)}
            </p>
          </CardContent>
        </Card>

        <Card glass hover className="fade-in fade-in-delay-2">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-sm text-muted-foreground">Net Cash Flow</p>
            </div>
            <p className={`text-2xl font-bold tracking-tight tabular-nums ${report.totalNet >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(report.totalNet)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Chart */}
      {chartData.length > 0 && (
        <Card glass className="fade-in fade-in-delay-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Cash Flow Trend
            </CardTitle>
            <CardDescription>Monthly inflow, outflow, and running balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', borderColor: '#333', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: unknown) => formatCurrency(Number(value ?? 0))}
                  />
                  <Area type="monotone" dataKey="inflow" stroke="#10b981" fillOpacity={1} fill="url(#inflowGrad)" name="Inflow" />
                  <Area type="monotone" dataKey="outflow" stroke="#ef4444" fillOpacity={1} fill="url(#outflowGrad)" name="Outflow" />
                  <Area type="monotone" dataKey="balance" stroke="#3b82f6" fillOpacity={1} fill="url(#balanceGrad)" name="Balance" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monthly Breakdown Table */}
      <Card glass className="fade-in fade-in-delay-2">
        <CardHeader>
          <CardTitle>Monthly Breakdown</CardTitle>
          <CardDescription>Cash flow details by month</CardDescription>
        </CardHeader>
        <CardContent>
          {report.months.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No transactions found for the selected period
            </div>
          ) : (
            <div className="space-y-1">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="col-span-3">Month</div>
                <div className="col-span-2 text-right">Inflow</div>
                <div className="col-span-2 text-right">Outflow</div>
                <div className="col-span-2 text-right">Net</div>
                <div className="col-span-3 text-right">Running Balance</div>
              </div>
              {/* Rows */}
              {report.months.map((month, index) => (
                <div
                  key={month.month}
                  className="grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-muted/30 transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="col-span-3 font-medium">{month.label}</div>
                  <div className="col-span-2 text-right text-green-500 tabular-nums font-semibold">
                    {formatCurrency(month.inflow)}
                  </div>
                  <div className="col-span-2 text-right text-red-500 tabular-nums font-semibold">
                    {formatCurrency(month.outflow)}
                  </div>
                  <div className={`col-span-2 text-right tabular-nums font-semibold ${month.net >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(month.net)}
                  </div>
                  <div className={`col-span-3 text-right tabular-nums font-bold ${month.runningBalance >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                    {formatCurrency(month.runningBalance)}
                  </div>
                </div>
              ))}
              {/* Total Row */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 border-t border-border/40 mt-2 font-bold">
                <div className="col-span-3">Total</div>
                <div className="col-span-2 text-right text-green-500 tabular-nums">
                  {formatCurrency(report.totalInflow)}
                </div>
                <div className="col-span-2 text-right text-red-500 tabular-nums">
                  {formatCurrency(report.totalOutflow)}
                </div>
                <div className={`col-span-2 text-right tabular-nums ${report.totalNet >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(report.totalNet)}
                </div>
                <div className="col-span-3"></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

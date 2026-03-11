// src/components/financial-management/reports/BalanceSheetReport.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useBalanceSheetReport } from "@/hooks/financial-management/useReports";
import { formatCurrency } from "@/lib/formatters";
import { Landmark, TrendingUp, TrendingDown, Scale } from "lucide-react";

export function BalanceSheetReport() {
  const { data: report, isLoading, error } = useBalanceSheetReport();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
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

  // Group assets by type
  const assetsByType = report.assets.reduce<Record<string, typeof report.assets>>((acc, asset) => {
    if (!acc[asset.type]) acc[asset.type] = [];
    acc[asset.type].push(asset);
    return acc;
  }, {});

  const isPositiveEquity = report.netEquity >= 0;

  return (
    <div className="space-y-6">
      {/* Top Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card glass hover className="fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Landmark className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-sm text-muted-foreground">Total Assets</p>
            </div>
            <p className="text-2xl font-bold text-blue-400 tracking-tight tabular-nums">
              {formatCurrency(report.totalAssets)}
            </p>
          </CardContent>
        </Card>

        <Card glass hover className="fade-in fade-in-delay-1">
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
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card glass hover className="fade-in fade-in-delay-2">
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
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card glass hover className="fade-in fade-in-delay-3">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg" style={{ background: isPositiveEquity ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }}>
                <Scale className={`h-5 w-5 ${isPositiveEquity ? 'text-green-500' : 'text-red-500'}`} />
              </div>
              <p className="text-sm text-muted-foreground">Net Equity</p>
            </div>
            <p className={`text-2xl font-bold tracking-tight tabular-nums ${isPositiveEquity ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(report.netEquity)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Assets + Revenue - Costs</p>
          </CardContent>
        </Card>
      </div>

      {/* Assets and Equity Side by Side */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Assets Panel */}
        <Card glass className="fade-in fade-in-delay-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-blue-500" />
              Assets
            </CardTitle>
            <CardDescription>Current asset portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            {report.assets.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No assets found
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(assetsByType).map(([type, assets]) => (
                  <div key={type}>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">{type}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {assets.length} {assets.length === 1 ? 'asset' : 'assets'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {assets.map((asset) => (
                        <div
                          key={asset.id}
                          className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted/30 transition-colors"
                        >
                          <div>
                            <p className="font-medium text-sm">{asset.name}</p>
                            <p className="text-xs text-muted-foreground">{asset.company}</p>
                          </div>
                          <p className="font-semibold text-blue-400 tabular-nums text-sm">
                            {formatCurrency(asset.value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {/* Total */}
                <div className="flex items-center justify-between px-3 py-3 border-t border-border/40 font-bold">
                  <p>Total Assets</p>
                  <p className="text-blue-400 tabular-nums">{formatCurrency(report.totalAssets)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Equity/Liabilities Panel */}
        <Card glass className="fade-in fade-in-delay-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-purple-500" />
              Equity Summary
            </CardTitle>
            <CardDescription>Financial position overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Revenue line */}
              <div className="flex items-center justify-between px-3 py-3 rounded-lg bg-green-500/5 border border-green-500/10">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">Total Revenue</p>
                    <p className="text-xs text-muted-foreground">All time earned income</p>
                  </div>
                </div>
                <p className="font-semibold text-green-500 tabular-nums">
                  {formatCurrency(report.totalRevenue)}
                </p>
              </div>

              {/* Costs line */}
              <div className="flex items-center justify-between px-3 py-3 rounded-lg bg-red-500/5 border border-red-500/10">
                <div className="flex items-center gap-3">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="font-medium text-sm">Total Costs</p>
                    <p className="text-xs text-muted-foreground">All time expenses</p>
                  </div>
                </div>
                <p className="font-semibold text-red-500 tabular-nums">
                  {formatCurrency(report.totalCosts)}
                </p>
              </div>

              {/* Operating Profit */}
              <div className="flex items-center justify-between px-3 py-3 border-t border-border/40">
                <p className="font-medium text-sm text-muted-foreground">Operating Profit</p>
                <p className={`font-bold tabular-nums ${report.totalRevenue - report.totalCosts >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(report.totalRevenue - report.totalCosts)}
                </p>
              </div>

              {/* Asset Value */}
              <div className="flex items-center justify-between px-3 py-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                <div className="flex items-center gap-3">
                  <Landmark className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm">Asset Value</p>
                    <p className="text-xs text-muted-foreground">Current portfolio worth</p>
                  </div>
                </div>
                <p className="font-semibold text-blue-400 tabular-nums">
                  {formatCurrency(report.totalAssets)}
                </p>
              </div>

              {/* Net Equity */}
              <div className="flex items-center justify-between px-3 py-4 border-t-2 border-border/60 mt-4">
                <div>
                  <p className="font-bold text-lg">Net Equity</p>
                  <p className="text-xs text-muted-foreground">Assets + Revenue - Costs</p>
                </div>
                <p className={`text-2xl font-bold tabular-nums ${isPositiveEquity ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(report.netEquity)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generated timestamp */}
      <p className="text-xs text-muted-foreground text-center">
        Report generated on {new Date(report.generatedAt).toLocaleString()}
      </p>
    </div>
  );
}

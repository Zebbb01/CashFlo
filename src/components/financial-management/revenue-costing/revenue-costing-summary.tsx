// src/components/financial-management/revenue-costing-summary.tsx
import React from "react";
import { formatCurrency } from "@/lib/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Activity, Wallet } from "lucide-react";

interface RevenueCostingSummaryProps {
  totalAssets: number;
  totalRevenue: number;
  totalCosting: number;
  netProfit: number;
}

export function RevenueCostingSummary({
  totalAssets,
  totalRevenue,
  totalCosting,
  netProfit,
}: RevenueCostingSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {/* Total Assets Card */}
      <Card className="glass-card scale-hover transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Projected Assets
          </CardTitle>
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Wallet className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight tabular-nums">
            {formatCurrency(totalAssets)}
          </div>
        </CardContent>
      </Card>

      {/* Total Revenue Card */}
      <Card className="glass-card scale-hover transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Revenue
          </CardTitle>
          <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 tracking-tight tabular-nums">
            {formatCurrency(totalRevenue)}
          </div>
        </CardContent>
      </Card>

      {/* Total Costing Card */}
      <Card className="glass-card scale-hover transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Costing
          </CardTitle>
          <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
            <Activity className="h-4 w-4 text-red-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive tracking-tight tabular-nums">
            {formatCurrency(-totalCosting)}
          </div>
        </CardContent>
      </Card>

      {/* Net Profit Card */}
      <Card className="glass-card scale-hover transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Net Profit
          </CardTitle>
          <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-indigo-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold tracking-tight tabular-nums ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatCurrency(netProfit)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
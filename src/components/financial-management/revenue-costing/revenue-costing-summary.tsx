// src/components/financial-management/revenue-costing-summary.tsx
import React from "react";
import { formatCurrency } from "@/lib/formatters";

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
    <div className="space-y-2 mb-6 tracking-tight tabular-nums">
      <h3 className="text-lg font-semibold">
        Total Projected Assets: {formatCurrency(totalAssets)}
      </h3>
      <h3 className="text-lg font-semibold text-blue-600">
        Total Revenue: {formatCurrency(totalRevenue)}
      </h3>
      <h3 className="text-lg font-semibold text-destructive">
        Total Costing: {formatCurrency(-totalCosting)}
      </h3>
      <h3 className={`text-lg font-semibold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
        Net Profit: {formatCurrency(netProfit)}
      </h3>
    </div>
  );
}
// src/components/financial-management/revenue-costing-summary.tsx
import React from "react";

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
    <div className="space-y-2 mb-6">
      <h3 className="text-lg font-semibold">
        Total Projected Assets: ₱{totalAssets.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </h3>
      <h3 className="text-lg font-semibold text-blue-600">
        Total Revenue: ₱{totalRevenue.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </h3>
      <h3 className="text-lg font-semibold text-destructive">
        Total Costing: -₱{totalCosting.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </h3>
      <h3 className={`text-lg font-semibold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
        Net Profit: ₱{netProfit.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </h3>
    </div>
  );
}
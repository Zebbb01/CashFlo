// src\app\dashboard\(financial-management)\financial-assets\page.tsx
"use client";

import { Separator } from "@/components/ui/separator";
import { RevenueCosting } from "@/components/financial-management/RevenueCosting";

export default function FinancialAssetsPage() {
  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Revenue & Costing</h1>
        <p className="text-gray-600">
          Manage your assets, track revenue and costs, and handle withdrawals.
        </p>

        <Separator />

        <RevenueCosting />

      </div>
    </div>
  );
}
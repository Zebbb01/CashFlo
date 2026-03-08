// src\app\dashboard\(financial-management)\financial-assets\page.tsx
"use client";

import { Separator } from "@/components/ui/separator";
import { RevenueCosting } from "@/components/financial-management/RevenueCosting";

// await new Promise((resolve) => {
//   setTimeout(() => {
//     resolve("intentional delay");
//   }, 5000);
// });  // Simulate loading delay

export default function FinancialAssetsPage() {
  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-primary">Revenue & Costing</h1>
        <p className="text-gray-600">
          Manage your assets, track revenue and costs, and handle withdrawals.
        </p>

        <Separator />

        <RevenueCosting />

      </div>
    </div>
  );
}
// src/app/dashboard/financial-management/page.tsx
"use client";

import { Separator } from "@/components/ui/separator";
import { AssetManagement } from "@/components/financial-management/AssetManagement";
import { RevenueCosting } from "@/components/financial-management/RevenueCosting";
import { WithdrawalHistory } from "@/components/financial-management/WithdrawalHistory";
import { ColleaguesContributions } from "@/components/financial-management/ColleaguesContributions";

export default function FinancialManagementPage() {
  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
        <p className="text-gray-600">
          Manage your assets, track revenue and costs, and handle withdrawals.
        </p>

        <Separator />

        <AssetManagement />

        <RevenueCosting />

        <WithdrawalHistory />

        <ColleaguesContributions />
      </div>
    </div>
  );
}
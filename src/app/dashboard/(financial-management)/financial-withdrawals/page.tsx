// src\app\dashboard\(financial-management)\financial-withdrawals\page.tsx
"use client";

import { Separator } from "@/components/ui/separator";
import { WithdrawalHistory } from "@/components/financial-management/WithdrawalHistory";

export default function FinancialWithdrawalsPage() {
  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Withdrawal History & Costs</h1>
        <p className="text-gray-600">
          Manage your assets, track revenue and costs, and handle withdrawals.
        </p>

        <Separator />

        <WithdrawalHistory />
      </div>
    </div>
  );
}
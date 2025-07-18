// src\app\dashboard\(financial-management)\financial-management\page.tsx
"use client";

import { Separator } from "@/components/ui/separator";
import { AssetManagement } from "@/components/financial-management/AssetManagement";

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

      </div>
    </div>
  );
}
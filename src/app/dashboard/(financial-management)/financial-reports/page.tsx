// src/app/dashboard/(financial-management)/financial-reports/page.tsx
"use client";

import React, { useState, useCallback } from "react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfitLossReport } from "@/components/financial-management/reports/ProfitLossReport";
import { CashFlowReport } from "@/components/financial-management/reports/CashFlowReport";
import { BalanceSheetReport } from "@/components/financial-management/reports/BalanceSheetReport";
import {
  exportPnlToCsv,
  exportCashFlowToCsv,
  exportBalanceSheetToCsv,
} from "@/utils/export-utils";
import { usePnlReport, useCashFlowReport, useBalanceSheetReport } from "@/hooks/financial-management/useReports";
import { Download, FileText, BarChart3, Scale, CalendarRange, RotateCcw } from "lucide-react";

export default function FinancialReportsPage() {
  const [activeTab, setActiveTab] = useState("pnl");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Get report data for export
  const { data: pnlData } = usePnlReport(
    startDate || undefined,
    endDate || undefined
  );
  const { data: cashFlowData } = useCashFlowReport(
    startDate || undefined,
    endDate || undefined
  );
  const { data: balanceSheetData } = useBalanceSheetReport();

  const handleExport = useCallback(() => {
    switch (activeTab) {
      case "pnl":
        if (pnlData) exportPnlToCsv(pnlData);
        break;
      case "cashflow":
        if (cashFlowData) exportCashFlowToCsv(cashFlowData);
        break;
      case "balancesheet":
        if (balanceSheetData) exportBalanceSheetToCsv(balanceSheetData);
        break;
    }
  }, [activeTab, pnlData, cashFlowData, balanceSheetData]);

  const handleClearDates = useCallback(() => {
    setStartDate("");
    setEndDate("");
  }, []);

  const hasDateFilter = startDate || endDate;

  return (
    <PageWrapper
      title="Reports and Export"
      description="Generate financial reports and export data for analysis"
      actions={
        <Button
          variant="gradient"
          onClick={handleExport}
          disabled={
            (activeTab === "pnl" && !pnlData) ||
            (activeTab === "cashflow" && !cashFlowData) ||
            (activeTab === "balancesheet" && !balanceSheetData)
          }
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      }
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList className="glass-card h-auto p-1 gap-1">
            <TabsTrigger
              value="pnl"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/20 data-[state=active]:to-emerald-500/20 data-[state=active]:text-green-400 px-4 py-2.5 gap-2"
            >
              <FileText className="h-4 w-4" />
              Profit and Loss
            </TabsTrigger>
            <TabsTrigger
              value="cashflow"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-400 px-4 py-2.5 gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Cash Flow
            </TabsTrigger>
            <TabsTrigger
              value="balancesheet"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-violet-500/20 data-[state=active]:text-purple-400 px-4 py-2.5 gap-2"
            >
              <Scale className="h-4 w-4" />
              Balance Sheet
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Date Range Filter (not shown for Balance Sheet since it's a snapshot) */}
        {activeTab !== "balancesheet" && (
          <div className="flex flex-wrap items-end gap-4 p-4 rounded-xl glass-card fade-in">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarRange className="h-4 w-4" />
              <span className="text-sm font-medium">Date Range</span>
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="startDate" className="text-xs text-muted-foreground">
                  From
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-40 h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endDate" className="text-xs text-muted-foreground">
                  To
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-40 h-9 text-sm"
                />
              </div>
              {hasDateFilter && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearDates}
                  className="h-9 gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Clear
                </Button>
              )}
            </div>
            {!hasDateFilter && (
              <p className="text-xs text-muted-foreground">
                Showing all time data. Select a range to filter.
              </p>
            )}
          </div>
        )}

        {/* Report Content */}
        <TabsContent value="pnl" className="mt-0">
          <ProfitLossReport
            startDate={startDate || undefined}
            endDate={endDate || undefined}
          />
        </TabsContent>

        <TabsContent value="cashflow" className="mt-0">
          <CashFlowReport
            startDate={startDate || undefined}
            endDate={endDate || undefined}
          />
        </TabsContent>

        <TabsContent value="balancesheet" className="mt-0">
          <BalanceSheetReport />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}

// src/app/dashboard/(financial-management)/financial-budgets/page.tsx
"use client";

import React, { useState } from "react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBudgets } from "@/hooks/financial-management/useBudgets";
import { formatCurrency } from "@/lib/formatters";
import { AddBudgetModal } from "@/components/financial-management/modals/BudgetModals/AddBudgetModal";
import { EditBudgetModal } from "@/components/financial-management/modals/BudgetModals/EditBudgetModal";
import { DeleteBudgetDialog } from "@/components/financial-management/modals/BudgetModals/DeleteBudgetDialog";
import type { BudgetWithActuals } from "@/types/budget";
import {
  Plus,
  Target,
  TrendingUp,
  TrendingDown,
  Wallet,
  MoreHorizontal,
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const statusConfig = {
  under: {
    label: "On Track",
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    icon: CheckCircle2,
    progressClass: "[&>div]:bg-green-500",
  },
  near: {
    label: "Approaching Limit",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    icon: AlertTriangle,
    progressClass: "[&>div]:bg-yellow-500",
  },
  over: {
    label: "Over Budget",
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    icon: AlertCircle,
    progressClass: "[&>div]:bg-red-500",
  },
};

export default function FinancialBudgetsPage() {
  const { data: budgets, isLoading, error } = useBudgets();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editBudget, setEditBudget] = useState<BudgetWithActuals | null>(null);
  const [deleteBudget, setDeleteBudget] = useState<{ id: string; name: string } | null>(null);

  const costBudgets = budgets?.filter((b) => b.type === "COST") || [];
  const revenueBudgets = budgets?.filter((b) => b.type === "REVENUE") || [];

  const totalBudgeted = budgets?.reduce((sum, b) => sum + b.amount, 0) || 0;
  const totalActual = budgets?.reduce((sum, b) => sum + b.actualAmount, 0) || 0;
  const overBudgetCount = budgets?.filter((b) => b.status === "over").length || 0;

  const renderBudgetCard = (budget: BudgetWithActuals) => {
    const config = statusConfig[budget.status];
    const StatusIcon = config.icon;
    const cappedPercentage = Math.min(budget.percentageUsed, 100);

    return (
      <Card
        key={budget.id}
        glass
        hover
        className={`fade-in border ${config.border} transition-all duration-300`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold truncate">{budget.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className={`text-xs ${budget.type === "COST" ? "text-red-400 border-red-400/30" : "text-green-400 border-green-400/30"}`}
                >
                  {budget.type === "COST" ? "Cost" : "Revenue"}
                </Badge>
                <span className="text-xs">{budget.category}</span>
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card">
                <DropdownMenuItem onClick={() => setEditBudget(budget)}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeleteBudget({ id: budget.id, name: budget.name })}
                  className="text-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {budget.type === "COST" ? "Spent" : "Earned"}
              </span>
              <span className={`font-semibold tabular-nums ${config.color}`}>
                {budget.percentageUsed.toFixed(1)}%
              </span>
            </div>
            <Progress value={cappedPercentage} className={`h-2.5 ${config.progressClass}`} />
          </div>

          {/* Amounts */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">
                {budget.type === "COST" ? "Actual Spend" : "Actual Earned"}
              </p>
              <p className="text-sm font-semibold tabular-nums">{formatCurrency(budget.actualAmount)}</p>
            </div>
            <div className="space-y-0.5 text-right">
              <p className="text-xs text-muted-foreground">
                {budget.type === "COST" ? "Limit" : "Target"}
              </p>
              <p className="text-sm font-semibold tabular-nums">{formatCurrency(budget.amount)}</p>
            </div>
          </div>

          {/* Status and Remaining */}
          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div className="flex items-center gap-1.5">
              <StatusIcon className={`h-3.5 w-3.5 ${config.color}`} />
              <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
            </div>
            <span className={`text-xs font-medium tabular-nums ${budget.remaining >= 0 ? 'text-muted-foreground' : 'text-red-400'}`}>
              {budget.remaining >= 0
                ? `${formatCurrency(budget.remaining)} remaining`
                : `${formatCurrency(Math.abs(budget.remaining))} over`
              }
            </span>
          </div>

          {/* Period badge */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              {budget.period}
            </Badge>
            <span>
              {new Date(budget.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              {" - "}
              {new Date(budget.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <PageWrapper
      title="Budget Planning"
      description="Set spending limits and revenue targets to track your financial goals"
      actions={
        <Button variant="gradient" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          Create Budget
        </Button>
      }
    >
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card glass hover className="fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Target className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-sm text-muted-foreground">Total Budgeted</p>
            </div>
            <p className="text-2xl font-bold text-blue-400 tracking-tight tabular-nums">
              {isLoading ? <Skeleton className="h-8 w-32" /> : formatCurrency(totalBudgeted)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {budgets?.length || 0} active {(budgets?.length || 0) === 1 ? 'budget' : 'budgets'}
            </p>
          </CardContent>
        </Card>

        <Card glass hover className="fade-in fade-in-delay-1">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Wallet className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-sm text-muted-foreground">Total Actual</p>
            </div>
            <p className="text-2xl font-bold text-purple-400 tracking-tight tabular-nums">
              {isLoading ? <Skeleton className="h-8 w-32" /> : formatCurrency(totalActual)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Across all budget categories
            </p>
          </CardContent>
        </Card>

        <Card glass hover className="fade-in fade-in-delay-2">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${overBudgetCount > 0 ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
                {overBudgetCount > 0 ? (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">Budget Health</p>
            </div>
            <p className={`text-2xl font-bold tracking-tight ${overBudgetCount > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {isLoading ? <Skeleton className="h-8 w-32" /> : overBudgetCount > 0 ? `${overBudgetCount} Over` : 'All Good'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {overBudgetCount > 0
                ? `${overBudgetCount} ${overBudgetCount === 1 ? 'budget' : 'budgets'} exceeded`
                : 'All budgets within limits'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Content */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} glass>
              <CardHeader>
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-3 w-28" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-2.5 w-full rounded-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card glass>
          <CardContent className="py-8">
            <p className="text-red-400 text-center">Failed to load budgets: {error.message}</p>
          </CardContent>
        </Card>
      ) : budgets && budgets.length === 0 ? (
        <Card glass className="fade-in">
          <CardContent className="py-16 text-center">
            <div className="p-4 rounded-2xl bg-muted/20 w-fit mx-auto mb-4">
              <Target className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No budgets yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first budget to start tracking spending limits and revenue targets against your actual financial data.
            </p>
            <Button variant="gradient" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4" />
              Create Your First Budget
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Cost Budgets */}
          {costBudgets.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="h-5 w-5 text-red-500" />
                <h2 className="text-lg font-semibold">Spending Limits</h2>
                <Badge variant="outline" className="text-xs text-red-400 border-red-400/30">
                  {costBudgets.length}
                </Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {costBudgets.map(renderBudgetCard)}
              </div>
            </div>
          )}

          {/* Revenue Budgets */}
          {revenueBudgets.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <h2 className="text-lg font-semibold">Revenue Targets</h2>
                <Badge variant="outline" className="text-xs text-green-400 border-green-400/30">
                  {revenueBudgets.length}
                </Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {revenueBudgets.map(renderBudgetCard)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <AddBudgetModal open={showAddModal} onOpenChange={setShowAddModal} />
      <EditBudgetModal
        open={!!editBudget}
        onOpenChange={(open) => !open && setEditBudget(null)}
        budget={editBudget}
      />
      <DeleteBudgetDialog
        open={!!deleteBudget}
        onOpenChange={(open) => !open && setDeleteBudget(null)}
        budgetId={deleteBudget?.id || null}
        budgetName={deleteBudget?.name || ""}
      />
    </PageWrapper>
  );
}

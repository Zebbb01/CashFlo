// src/app/dashboard/page.tsx
"use client";
import React from "react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Users, Activity, Calendar } from "lucide-react"; // Added Calendar icon
import { useFinancialTotals, useRevenues, useCosts } from "@/hooks/financial-management/useRevenueCost"; // Import financial hooks
import { useSession } from "next-auth/react"; // Import useSession
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { DashboardTransaction } from "@/types/financial"; // Import the unified transaction type

export default function DashboardPage() {
  const { data: session } = useSession();
  const userId = session?.user.id; // Get current user ID

  // Fetch financial totals
  const {
    totalRevenue,
    totalCosting,
    totalAssets,
    isLoading: isLoadingTotals,
    error: totalsError,
  } = useFinancialTotals();

  // Fetch all revenues and costs for the recent transactions table
  const { data: revenues, isLoading: isLoadingRevenues, error: revenuesError } = useRevenues();
  const { data: costs, isLoading: isLoadingCosts, error: costsError } = useCosts();

  // Calculate net profit
  const netProfit = totalRevenue - totalCosting;

  // Combine and sort all revenues and costs for the recent transactions table
  const recentTransactions: DashboardTransaction[] = React.useMemo(() => {
    const revenueTransactions: DashboardTransaction[] = (revenues || []).map(rev => ({
      id: rev.id,
      amount: rev.amount,
      date: rev.date,
      description: rev.description,
      userId: rev.userId,
      bankAssetManagementId: rev.bankAssetManagementId,
      type: 'revenue',
      source: rev.source,
    }));

    const costTransactions: DashboardTransaction[] = (costs || []).map(cost => ({
      id: cost.id,
      amount: cost.amount,
      date: cost.date,
      description: cost.description,
      userId: cost.userId,
      bankAssetManagementId: cost.bankAssetManagementId,
      type: 'cost',
      category: cost.category,
    }));

    // Sort by date, most recent first
    return [...revenueTransactions, ...costTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [revenues, costs]);

  // Define columns for the DataTable
  const columns = React.useMemo(() => [
    {
      header: "Type",
      cell: (row: DashboardTransaction) => (
        <Badge variant={row.type === "revenue" ? "default" : "destructive"}>
          {row.type === "revenue" ? "REVENUE" : "COST"}
        </Badge>
      ),
    },
    {
      header: "Description / Category",
      cell: (row: DashboardTransaction) => (
        <span className="font-medium">
          {row.description || (row.type === 'revenue' ? row.source : row.category)}
        </span>
      ),
    },
    {
      header: "Amount",
      cell: (row: DashboardTransaction) => (
        <span className={`font-semibold ${row.type === 'revenue' ? 'text-green-500' : 'text-red-500'}`}>
          {row.type === 'revenue' ? '+' : '-'}${row.amount.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Date",
      cell: (row: DashboardTransaction) => (
        <span className="text-muted-foreground flex items-center gap-1">
          <Calendar className="w-3 h-3" /> {new Date(row.date).toLocaleDateString()}
        </span>
      ),
    },
  ], []);

  const isLoading = isLoadingTotals || isLoadingRevenues || isLoadingCosts;
  const error = totalsError || revenuesError || costsError;

  if (isLoading) {
    return (
      <PageWrapper
        title="Dashboard Overview"
        description="Welcome to your financial command center"
        actions={
          <div className="flex gap-2">
            <Skeleton className="w-24 h-9 rounded-md" />
            <Skeleton className="w-32 h-9 rounded-md" />
          </div>
        }
      >
        {/* Stats Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="glass-card h-32" />
          ))}
        </div>

        {/* Revenue Costing Summary Skeleton */}
        <div className="space-y-2 mb-6">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>

        {/* Recent Transactions Skeleton */}
        <Card glass hover className="fade-in fade-in-delay-1">
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>

        {/* Additional content section skeleton */}
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <Skeleton className="glass-card h-64" />
          <Skeleton className="glass-card h-64" />
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper
        title="Dashboard Overview"
        description="Welcome to your financial command center"
      >
        <div className="text-red-500 p-4">
          Error loading financial data: {error?.message || "An unknown error occurred."}
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Dashboard Overview"
      description="Welcome to your financial command center"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" className="scale-hover">
            Export Data
          </Button>
          <Button variant="gradient">
            <TrendingUp className="w-4 h-4" />
            View Analytics
          </Button>
        </div>
      }
    >
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card glass hover className="fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground floating" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient-primary">
              ${totalRevenue.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {/* Placeholder for actual growth rate logic */}
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card glass hover className="fade-in fade-in-delay-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Costs
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground floating" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient-secondary">
              ${totalCosting.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Total expenses recorded
            </p>
          </CardContent>
        </Card>

        <Card glass hover className="fade-in fade-in-delay-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Net Profit
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground floating" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${netProfit.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Total revenue minus costs
            </p>
          </CardContent>
        </Card>

        <Card glass hover className="fade-in fade-in-delay-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Assets
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground floating" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient-accent">
              ${totalAssets.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Current portfolio value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div className="space-y-6">
        <Card glass hover className="fade-in fade-in-delay-1">
          <CardHeader>
            <CardTitle gradient>Recent Transactions</CardTitle>
            <CardDescription>
              Your latest financial activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={recentTransactions} // Use real data
              noDataMessage="No transactions found"
            />
          </CardContent>
        </Card>

        {/* Additional content section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card glass hover className="fade-in fade-in-delay-2">
            <CardHeader>
              <CardTitle gradient>Quick Actions</CardTitle>
              <CardDescription>
                Frequently used features and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="gradient" className="w-full" onClick={() => window.location.href = '/dashboard/revenues-costs'}>
                <DollarSign className="w-4 h-4" />
                Manage Transactions
              </Button>
              <Button variant="gradientSecondary" className="w-full" onClick={() => window.location.href = '/dashboard/assets'}>
                <Activity className="w-4 h-4" />
                Manage Assets
              </Button>
              <Button variant="outline" className="w-full scale-hover" onClick={() => window.location.href = '/dashboard/general'}>
                <TrendingUp className="w-4 h-4" />
                View Reports
              </Button>
            </CardContent>
          </Card>

          <Card glass hover className="fade-in fade-in-delay-3">
            <CardHeader>
              <CardTitle gradient>System Status</CardTitle>
              <CardDescription>
                Current system health and performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database</span>
                <Badge variant="default">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Services</span>
                <Badge variant="default">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Background Jobs</span>
                <Badge variant="secondary">Processing</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cache</span>
                <Badge variant="default">Optimized</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
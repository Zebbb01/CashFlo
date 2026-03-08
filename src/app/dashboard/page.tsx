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
import { formatCurrency } from "@/lib/formatters";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

  // Prepare chart data: group revenues and costs by date
  const chartData = React.useMemo(() => {
    if (!revenues && !costs) return [];

    const dataMap: Record<string, { date: string; revenue: number; cost: number; rawDate: Date }> = {};

    const processData = (items: any[], type: 'revenue' | 'cost') => {
      items.forEach(item => {
        const rawDate = new Date(item.date);
        const dateStr = rawDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!dataMap[dateStr]) {
          dataMap[dateStr] = { date: dateStr, revenue: 0, cost: 0, rawDate };
        }
        dataMap[dateStr][type] += item.amount;
      });
    };

    if (revenues) processData(revenues, 'revenue');
    if (costs) processData(costs, 'cost');

    // Sort chronologically and keep last 30 data points
    return Object.values(dataMap)
      .sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime())
      .slice(-30);
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
        <span className={`font-semibold tracking-tight tabular-nums ${row.type === 'revenue' ? 'text-green-500' : 'text-red-500'}`}>
          {row.type === 'revenue' ? '+' : '-'}{formatCurrency(row.amount).replace('₱', '')}
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
            <div className="text-2xl font-bold text-gradient-primary tracking-tight tabular-nums">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
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
            <div className="text-2xl font-bold text-gradient-secondary tracking-tight tabular-nums">
              {formatCurrency(totalCosting)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
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
            <div className={`text-2xl font-bold tracking-tight tabular-nums ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(netProfit)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
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
            <div className="text-2xl font-bold text-gradient-accent tracking-tight tabular-nums">
              {formatCurrency(totalAssets)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
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

        {/* Analytics & Quick Actions Section */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Financial Overview Chart */}
          <Card glass hover className="md:col-span-2 fade-in fade-in-delay-2">
            <CardHeader>
              <CardTitle gradient>Financial Overview</CardTitle>
              <CardDescription>
                Revenue and Costs over the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₱${value}`} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', borderColor: '#333', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
                      <Area type="monotone" dataKey="cost" stroke="#ef4444" fillOpacity={1} fill="url(#colorCost)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex bg-muted/20 rounded-lg items-center justify-center h-full text-muted-foreground">
                    No data available for visualization
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card glass hover className="md:col-span-1 fade-in fade-in-delay-3">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle gradient>Quick Actions</CardTitle>
                  <CardDescription>Frequently used features</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/dashboard/financial-management" className="w-full inline-block">
                <Button variant="gradient" className="w-full justify-start">
                  <Activity className="w-4 h-4 mr-2" />
                  Manage Finances
                </Button>
              </Link>
              <Link href="/dashboard/financial-colleagues" className="w-full inline-block">
                <Button variant="gradientSecondary" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Colleagues
                </Button>
              </Link>
              <Link href="/dashboard/quick-actions" className="w-full inline-block mt-4">
                <Button variant="outline" className="w-full scale-hover justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Open Action Hub
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
// src/components/data-visualization/charts-section.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, PieChart, BarChart3, Activity } from "lucide-react";
import { useRevenues, useCosts } from "@/hooks/financial-management/useRevenueCost";
import { useAssets } from "@/hooks/financial-management/useAssets";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, Legend
} from 'recharts';
import { formatCurrency } from "@/lib/formatters";

// Define a professional color palette matching the glassmorphism theme
const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#14b8a6', '#f59e0b', '#3b82f6'];
const REVENUE_COLOR = '#10b981'; // Green for revenue
const COST_COLOR = '#f43f5e'; // Red-pink for costs

export function ChartsSection() {
  const { data: revenues, isLoading: isLoadingRev } = useRevenues();
  const { data: costs, isLoading: isLoadingCost } = useCosts();
  const { data: assets, isLoading: isLoadingAssets } = useAssets();

  // Process data for Revenue vs Expense Chart (monthly aggregation)
  const monthlyData = useMemo(() => {
    if (!revenues && !costs) return [];

    const dataMap = new Map<string, { month: string; revenue: number; costs: number }>();

    // Helper to get YYYY-MM
    const getMonthKey = (dateStr: string | Date) => {
      const d = new Date(dateStr);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    };

    // Helper to format month for display
    const formatMonth = (key: string) => {
      const [year, month] = key.split('-');
      const d = new Date(parseInt(year), parseInt(month) - 1, 1);
      return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    };

    revenues?.forEach(rev => {
      const key = getMonthKey(rev.date);
      if (!dataMap.has(key)) dataMap.set(key, { month: formatMonth(key), revenue: 0, costs: 0 });
      dataMap.get(key)!.revenue += rev.amount;
    });

    costs?.forEach(cost => {
      const key = getMonthKey(cost.date);
      if (!dataMap.has(key)) dataMap.set(key, { month: formatMonth(key), revenue: 0, costs: 0 });
      dataMap.get(key)!.costs += cost.amount;
    });

    // Sort chronologically and return
    return Array.from(dataMap.entries())
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([_, value]) => value);
  }, [revenues, costs]);

  // Process data for Asset Allocation Pie Chart
  const assetData = useMemo(() => {
    if (!assets) return [];

    const typeMap = new Map<string, number>();
    assets.forEach(asset => {
      const type = asset.assetType || 'Other';
      const value = asset.assetValue || 0;
      typeMap.set(type, (typeMap.get(type) || 0) + value);
    });

    return Array.from(typeMap.entries())
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [assets]);

  const isLoading = isLoadingRev || isLoadingCost || isLoadingAssets;

  if (isLoading) {
    return (
      <>
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="glass-card h-[350px]" />
          <Skeleton className="glass-card h-[350px]" />
        </div>
      </>
    );
  }

  // Custom generic tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-md border border-border p-3 rounded-lg shadow-xl">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm my-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground capitalize">{entry.name}:</span>
              <span className="font-semibold tabular-nums tracking-tight" style={{ color: entry.color }}>
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="mb-6 fade-in">
        <h2 className="text-2xl font-bold text-gradient-primary mb-2">
          Charts & Trends
        </h2>
        <p className="text-muted-foreground">
          Visual insights into your financial data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card scale-hover fade-in fade-in-delay-1">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center floating">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Revenue & Expenses Over Time</CardTitle>
                <CardDescription>Monthly breakdown and trends</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] mt-4">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={REVENUE_COLOR} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={REVENUE_COLOR} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COST_COLOR} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COST_COLOR} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₱${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area type="monotone" name="Revenue" dataKey="revenue" stroke={REVENUE_COLOR} strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" name="Costs" dataKey="costs" stroke={COST_COLOR} strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <BarChart3 className="w-12 h-12 mb-3 opacity-20" />
                <p>No transaction data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card scale-hover fade-in fade-in-delay-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center floating" style={{ animationDelay: '0.2s' }}>
                <PieChart className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Asset Allocation</CardTitle>
                <CardDescription>Distribution of your portfolio by type</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] mt-4">
            {assetData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  <Pie
                    data={assetData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {assetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Activity className="w-12 h-12 mb-3 opacity-20" />
                <p>No asset data available to visualize</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
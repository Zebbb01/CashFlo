// src/components/data-visualization/key-metrics.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useFinancialTotals } from "@/hooks/financial-management/useRevenueCost";
import { Skeleton } from "@/components/ui/skeleton";

export function KeyMetrics() {
  const { totalRevenue, totalCosting, totalAssets, netProfit, isLoading } = useFinancialTotals();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="glass-card h-[140px]" />
          ))}
        </div>
      </div>
    );
  }

  const metrics = [
    {
      title: "Total Assets",
      value: `₱${totalAssets.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: "Current value of all your assets",
      icon: Wallet,
      gradient: "bg-gradient-primary",
      trend: "+12.5%",
      trendUp: true,
      delay: 0,
    },
    {
      title: "Total Revenue",
      value: `₱${totalRevenue.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: "Income generated across all sources",
      icon: TrendingUp,
      gradient: "bg-gradient-secondary",
      trend: "+8.2%",
      trendUp: true,
      delay: 0.1,
    },
    {
      title: "Total Expenses",
      value: `₱${totalCosting.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: "All recorded expenditures",
      icon: TrendingDown,
      gradient: "bg-gradient-accent",
      trend: "-5.1%",
      trendUp: false,
      delay: 0.2,
    },
    {
      title: "Net Profit",
      value: `₱${Math.abs(netProfit).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: "Revenue minus expenses",
      icon: DollarSign,
      gradient: netProfit >= 0 ? "bg-gradient-primary" : "bg-red-500",
      trend: netProfit >= 0 ? "+15.3%" : "-15.3%",
      trendUp: netProfit >= 0,
      delay: 0.3,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gradient-primary mb-2">
          Key Metrics
        </h2>
        <p className="text-muted-foreground">
          Your financial performance at a glance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card
            key={index}
            className={`glass-card scale-hover fade-in`}
            style={{ animationDelay: `${metric.delay}s` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  {metric.description}
                </CardDescription>
              </div>
              <div className={`w-10 h-10 ${metric.gradient} rounded-lg flex items-center justify-center floating`}>
                <metric.icon className="w-5 h-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gradient-primary mb-2">
                {metric.value}
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-xs font-medium ${metric.trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                  {metric.trend}
                </span>
                <span className="text-xs text-muted-foreground">
                  vs last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
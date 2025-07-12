// src/components/data-visualization/key-metrics.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export function KeyMetrics() {
  const metrics = [
    {
      title: "Total Assets",
      value: "₱1,234,567.89",
      description: "Current value of all your assets",
      icon: Wallet,
      gradient: "bg-gradient-primary",
      trend: "+12.5%",
      trendUp: true,
      delay: 0,
    },
    {
      title: "Monthly Revenue",
      value: "₱55,123.45",
      description: "Income generated this month",
      icon: TrendingUp,
      gradient: "bg-gradient-secondary",
      trend: "+8.2%",
      trendUp: true,
      delay: 0.1,
    },
    {
      title: "Total Expenses",
      value: "₱21,987.65",
      description: "All expenditures this month",
      icon: TrendingDown,
      gradient: "bg-gradient-accent",
      trend: "-5.1%",
      trendUp: false,
      delay: 0.2,
    },
    {
      title: "Net Income",
      value: "₱33,135.80",
      description: "Revenue minus expenses",
      icon: DollarSign,
      gradient: "bg-gradient-primary",
      trend: "+15.3%",
      trendUp: true,
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
                <span className={`text-xs font-medium ${
                  metric.trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
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
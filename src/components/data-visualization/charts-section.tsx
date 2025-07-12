// src/components/data-visualization/charts-section.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, PieChart, BarChart3, Activity } from "lucide-react";

export function ChartsSection() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gradient-primary mb-2">
          Charts & Trends
        </h2>
        <p className="text-muted-foreground">
          Visual insights into your financial data
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card scale-hover">
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
          <CardContent className="flex items-center justify-center h-[200px]">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4 floating" />
              <p className="text-muted-foreground">
                Interactive Line Chart Coming Soon
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Track your financial performance over time
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card scale-hover">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center floating">
                <PieChart className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Asset Allocation</CardTitle>
                <CardDescription>Distribution of your portfolio</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[200px]">
            <div className="text-center">
              <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4 floating" style={{ animationDelay: '0.5s' }} />
              <p className="text-muted-foreground">
                Interactive Pie Chart Coming Soon
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Visualize your asset distribution
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
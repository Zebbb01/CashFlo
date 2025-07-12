// src/app/dashboard/page.tsx
"use client";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Users, Activity } from "lucide-react";

// Sample data for demonstration
const sampleData = [
  { id: 1, name: "John Doe", amount: 1200, status: "Completed", date: "2024-01-15" },
  { id: 2, name: "Jane Smith", amount: 850, status: "Pending", date: "2024-01-14" },
  { id: 3, name: "Bob Johnson", amount: 2100, status: "Completed", date: "2024-01-13" },
];

const columns = [
  {
    header: "Name",
    cell: (row: any) => <span className="font-medium">{row.name}</span>
  },
  {
    header: "Amount",
    cell: (row: any) => (
      <span className="text-gradient-primary font-semibold">
        ${row.amount.toLocaleString()}
      </span>
    )
  },
  {
    header: "Status",
    cell: (row: any) => (
      <Badge variant={row.status === "Completed" ? "default" : "secondary"}>
        {row.status}
      </Badge>
    )
  },
  {
    header: "Date",
    cell: (row: any) => <span className="text-muted-foreground">{row.date}</span>
  }
];

export default function DashboardPage() {
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
            <div className="text-2xl font-bold text-gradient-primary">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card glass hover className="fade-in fade-in-delay-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground floating" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient-secondary">+2,350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card glass hover className="fade-in fade-in-delay-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sales
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground floating" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient-primary">+12,234</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>

        <Card glass hover className="fade-in fade-in-delay-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Now
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground floating" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient-accent">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
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
              data={sampleData}
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
              <Button variant="gradient" className="w-full">
                <DollarSign className="w-4 h-4" />
                Create New Transaction
              </Button>
              <Button variant="gradientSecondary" className="w-full">
                <Users className="w-4 h-4" />
                Manage Team
              </Button>
              <Button variant="outline" className="w-full scale-hover">
                <Activity className="w-4 h-4" />
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
                <Badge variant="default" className="bg-green-500">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Services</span>
                <Badge variant="default" className="bg-green-500">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Background Jobs</span>
                <Badge variant="secondary">Processing</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cache</span>
                <Badge variant="default" className="bg-green-500">Optimized</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
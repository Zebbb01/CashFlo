// src/app/dashboard/page.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import {
    Landmark, // For Total Assets card
    PieChart, // For Monthly Revenue card
    Wallet,   // For Net Income card
    Users     // For Active Projects card
} from "lucide-react" // Import icons if used in this specific page

export default function DashboardOverviewPage() {
  const totalAssets = "$1,500,000.00";
  const monthlyRevenue = "$75,000.00";
  const netIncome = "$30,000.00";
  const activeProjects = "5";

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">A quick glance at your key financial metrics and activities.</p>

        <Separator />

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <Landmark className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAssets}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyRevenue}</div>
              <p className="text-xs text-muted-foreground">+18.0% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Income</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{netIncome}</div>
              <p className="text-xs text-muted-foreground">Increased by 10%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects}</div>
              <p className="text-xs text-muted-foreground">Currently being managed</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity / Quick Links */}
        <h2 className="text-2xl font-bold text-gray-900 mt-8">Recent Activity & Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Latest Transactions</CardTitle>
              <CardDescription>Recently recorded income and expenses.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><span className="font-semibold">June 5:</span> Received payment from Client A - <span className="text-green-600">+$2,500</span></li>
                <li><span className="font-semibold">June 4:</span> Paid utilities - <span className="text-red-600">-$350</span></li>
                <li><span className="font-semibold">June 3:</span> ATM withdrawal - <span className="text-red-600">-$200</span></li>
              </ul>
              <Button variant="link" className="px-0 mt-4">View All Transactions</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Tasks</CardTitle>
              <CardDescription>Important actions to take.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>Review Q2 Financial Report</li>
                <li>Add new asset: Investment Property</li>
                <li>Categorize May expenses</li>
              </ul>
              <Button variant="link" className="px-0 mt-4">Go to Financial Management</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
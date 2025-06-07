// src/app/dashboard/data-visualization/page.tsx
"use client"

import { Session } from "next-auth" // Assuming you still need session for the welcome card
import { signOut } from "next-auth/react" // Keep signOut for the button
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// If you pass session as a prop to this page, you'd need to fetch it here in a client component
// or pass it from a server component if this were a direct page.
// However, since it's now a nested route, the session might be fetched higher up
// and contextually provided, or you can refetch it here if needed.
// For this example, I'll assume session is available via prop for the Welcome Card,
// but for real data, you might need a client-side fetch or a parent server component.

interface DataVisualizationPageProps {
  session?: Session; // Make session optional if it's not always passed directly
}

export default function DataVisualizationPage({ session }: DataVisualizationPageProps) {
  // Mock session data if not passed or for local development
  const currentSession = session || { user: { name: "Guest User", email: "guest@example.com", id: "123" } };

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Data Visualization</h1>
        <p className="text-gray-600">Overview of your financial performance through charts and key metrics.</p>

        <Separator />

        {/* Existing Welcome Card from DashboardClient */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Welcome to CashFlo</CardTitle>
            <CardDescription>
              Your personal finance management dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Name:</strong> {currentSession.user?.name}</p>
              <p><strong>Email:</strong> {currentSession.user?.email}</p>
              <p><strong>User ID:</strong> {currentSession.user?.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Section for Key Metrics / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Assets</CardTitle>
              <CardDescription>Current value of all your assets.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">$1,234,567.89</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Income generated this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">$55,123.45</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Expenses</CardTitle>
              <CardDescription>All expenditures this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-red-600">-$21,987.65</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Net Income</CardTitle>
              <CardDescription>Revenue minus expenses.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-green-600">$33,135.80</p>
            </CardContent>
          </Card>
        </div>

        {/* Section for Charts (e.g., Revenue vs. Expenses, Asset Allocation) */}
        <h2 className="text-2xl font-bold text-gray-900 mt-8">Charts & Trends</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="aspect-video">
            <CardHeader>
              <CardTitle>Revenue & Expenses Over Time</CardTitle>
              <CardDescription>Monthly breakdown</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[200px]">
              <p className="text-muted-foreground">Chart placeholder (e.g., Line Chart)</p>
            </CardContent>
          </Card>

          <Card className="aspect-video">
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
              <CardDescription>Distribution of your assets</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[200px]">
              <p className="text-muted-foreground">Chart placeholder (e.g., Pie Chart)</p>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards (from original DashboardClient) */}
        <h2 className="text-2xl font-bold text-gray-900 mt-8">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Accounts</CardTitle>
              <CardDescription>Manage your bank accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Add and track your various bank accounts and balances.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>Track your expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Record and categorize your income and expenses.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Financial insights</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Generate reports and visualize your financial data.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sign Out Button - placed here within the page for easy access */}
        <div className="mt-8 text-right">
          <Button
            variant="outline"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
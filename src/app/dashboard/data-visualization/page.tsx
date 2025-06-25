// src/app/dashboard/data-visualization/page.tsx
"use client"

import { useSession, signOut } from "next-auth/react" // Import useSession
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useEffect } from "react" // Keep useState and useEffect if you plan to fetch other data
import { Spinner } from "@/components/ui/spinner"

export default function DataVisualizationPage() {
  // Use the useSession hook to get the session data
  const { data: session, status } = useSession();

  useEffect(() => {
  }, [status, session]); // Dependencies for this useEffect

  // Render a loading state while session is being fetched
  if (status === "loading") {
    return (
      <div className="flex-1 overflow-auto p-4 flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  // Render a message if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="flex-1 overflow-auto p-4 flex flex-col justify-center items-center text-center">
        <p className="text-lg text-red-500 mb-4">You need to be logged in to view this page.</p>
        <Button onClick={() => signOut()}>Sign Out / Go to Login</Button>
      </div>
    );
  }

  // Once authenticated, render the dashboard content
  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Data Visualization</h1>
        <p className="text-gray-600">Overview of your financial performance through charts and key metrics.</p>

        <Separator />

        {/* Displaying actual session data */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Welcome to CashFlo</CardTitle>
            <CardDescription>
              Your personal finance management dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Name:</strong> {session?.user?.name || "N/A"}</p>
              <p><strong>Email:</strong> {session?.user?.email || "N/A"}</p>
              <p><strong>User ID:</strong> {session?.user?.id || "N/A"}</p>
              {/* You might also display image if available */}
              {session?.user?.image && (
                <p><strong>Avatar:</strong> <img src={session.user.image} alt="User Avatar" className="h-8 w-8 rounded-full inline-block ml-2" /></p>
              )}
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
              <p className="text-2xl font-semibold">₱1,234,567.89</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Income generated this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">₱55,123.45</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Expenses</CardTitle>
              <CardDescription>All expenditures this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-red-600">-₱21,987.65</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Net Income</CardTitle>
              <CardDescription>Revenue minus expenses.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-green-600">₱33,135.80</p>
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
      </div>
    </div>
  )
}
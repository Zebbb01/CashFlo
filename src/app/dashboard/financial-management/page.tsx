// src/app/dashboard/financial-management/page.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

export default function FinancialManagementPage() {
  const [assetName, setAssetName] = useState("")
  const [assetValue, setAssetValue] = useState("")
  const [colleagueName, setColleagueName] = useState("")
  const [colleagueRevenue, setColleagueRevenue] = useState("")
  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [withdrawalDescription, setWithdrawalDescription] = useState("")

  const handleAddAsset = () => {
    console.log("Adding asset:", { assetName, assetValue })
    // Implement logic to add asset (e.g., API call, state update)
    setAssetName("")
    setAssetValue("")
  }

  const handleAddColleagueRevenue = () => {
    console.log("Adding colleague revenue:", { colleagueName, colleagueRevenue })
    // Implement logic to add colleague revenue
    setColleagueName("")
    setColleagueRevenue("")
  }

  const handleAddWithdrawal = () => {
    console.log("Adding withdrawal:", { withdrawalAmount, withdrawalDescription })
    // Implement logic to add withdrawal
    setWithdrawalAmount("")
    setWithdrawalDescription("")
  }

  // Sample data for demonstration
  const withdrawalHistory = [
    { id: 1, date: "2025-05-30", amount: 1500, description: "Rent Payment" },
    { id: 2, date: "2025-05-28", amount: 250, description: "Groceries" },
    { id: 3, date: "2025-05-25", amount: 500, description: "Utilities" },
  ]

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
        <p className="text-gray-600">
          Manage your assets, track revenue and costs, and handle withdrawals.
        </p>

        <Separator />

        {/* Section for Asset Management */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Management</CardTitle>
            <CardDescription>Add and track your assets.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assetName">Asset Name</Label>
                <Input
                  id="assetName"
                  placeholder="e.g., Real Estate, Stocks, Savings Account"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="assetValue">Asset Value</Label>
                <Input
                  id="assetValue"
                  type="number"
                  placeholder="e.g., 500000"
                  value={assetValue}
                  onChange={(e) => setAssetValue(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleAddAsset} className="mt-4">Add Asset</Button>
            {/* Display current assets here (e.g., a table) */}
            <h3 className="text-lg font-semibold mt-6 mb-2">Current Assets</h3>
            <p className="text-muted-foreground">List of assets will appear here...</p>
          </CardContent>
        </Card>

        {/* Section for Revenue with Costing */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Costing</CardTitle>
            <CardDescription>Track your total revenue and associated costs.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Forms or display for total revenue, total costs, net revenue */}
            <p className="text-muted-foreground">Input fields for revenue sources and costs will go here.</p>
            <h3 className="text-lg font-semibold mt-6 mb-2">Total Revenue: $XXX,XXX.XX</h3>
            <h3 className="text-lg font-semibold mb-2">Total Costing: -$XX,XXX.XX</h3>
            <h3 className="text-lg font-semibold text-green-600">Net: $XXX,XXX.XX</h3>
          </CardContent>
        </Card>

        {/* Section for Withdrawal History and Costs */}
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal History & Costs</CardTitle>
            <CardDescription>Record and view your withdrawals and their impact.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="withdrawalAmount">Withdrawal Amount</Label>
                <Input
                  id="withdrawalAmount"
                  type="number"
                  placeholder="e.g., 1000"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="withdrawalDescription">Description</Label>
                <Textarea
                  id="withdrawalDescription"
                  placeholder="e.g., House rent, new gadget"
                  value={withdrawalDescription}
                  onChange={(e) => setWithdrawalDescription(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleAddWithdrawal} className="mt-4">Add Withdrawal</Button>

            <h3 className="text-lg font-semibold mt-6 mb-2">Recent Withdrawals</h3>
            <div className="border rounded-md">
              {withdrawalHistory.length > 0 ? (
                <ul className="divide-y">
                  {withdrawalHistory.map((item) => (
                    <li key={item.id} className="p-3 flex justify-between items-center">
                      <span>{item.date}: {item.description}</span>
                      <span className="font-medium text-red-600">-${item.amount.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-3 text-muted-foreground">No withdrawal history.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section for Colleagues' Revenue & Withdrawals */}
        <Card>
          <CardHeader>
            <CardTitle>Colleagues' Financial Contributions</CardTitle>
            <CardDescription>Add and track revenue and withdrawals by colleagues on specific assets.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="colleagueName">Colleague Name</Label>
                <Input
                  id="colleagueName"
                  placeholder="e.g., Jane Smith"
                  value={colleagueName}
                  onChange={(e) => setColleagueName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="colleagueRevenue">Revenue Amount</Label>
                <Input
                  id="colleagueRevenue"
                  type="number"
                  placeholder="e.g., 500"
                  value={colleagueRevenue}
                  onChange={(e) => setColleagueRevenue(e.target.value)}
                />
              </div>
              {/* You'll need a way to link this to a particular asset */}
              {/* <div className="md:col-span-2">
                <Label htmlFor="linkedAsset">Link to Asset</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an asset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asset1">Real Estate</SelectItem>
                    <SelectItem value="asset2">Stocks</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
            </div>
            <Button onClick={handleAddColleagueRevenue} className="mt-4">Add Colleague Revenue</Button>

            <h3 className="text-lg font-semibold mt-6 mb-2">Colleagues' Contributions</h3>
            <p className="text-muted-foreground">List of colleagues' revenue and withdrawals will appear here, linked to assets.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
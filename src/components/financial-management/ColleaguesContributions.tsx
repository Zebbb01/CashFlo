// src/components/financial-management/ColleaguesContributions.tsx
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  User, 
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Filter
} from "lucide-react";

// Mock data for demonstration
const mockColleagues = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "AJ",
    totalContributions: 8500,
    totalWithdrawals: 2300,
    netContribution: 6200,
    lastActivity: "2 hours ago",
    status: "active"
  },
  {
    id: 2,
    name: "Bob Smith",
    avatar: "BS",
    totalContributions: 12000,
    totalWithdrawals: 4500,
    netContribution: 7500,
    lastActivity: "1 day ago",
    status: "active"
  },
  {
    id: 3,
    name: "Carol Davis",
    avatar: "CD",
    totalContributions: 6800,
    totalWithdrawals: 1200,
    netContribution: 5600,
    lastActivity: "3 days ago",
    status: "inactive"
  }
];

const mockTransactions = [
  {
    id: 1,
    type: "contribution",
    amount: 1500,
    colleague: "Alice Johnson",
    asset: "Property A",
    date: "2024-01-15",
    description: "Monthly investment contribution"
  },
  {
    id: 2,
    type: "withdrawal",
    amount: 800,
    colleague: "Bob Smith",
    asset: "Stock Portfolio",
    date: "2024-01-14",
    description: "Partial withdrawal for expenses"
  },
  {
    id: 3,
    type: "contribution",
    amount: 2200,
    colleague: "Carol Davis",
    asset: "Crypto Fund",
    date: "2024-01-13",
    description: "Quarterly investment boost"
  }
];

export function ColleaguesContributions() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Main Card with Glass Morphism */}
      <Card className="glass-card border-0 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-gradient-primary">
                Colleagues' Financial Contributions
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Track and manage revenue and withdrawals by colleagues across your assets
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="scale-hover">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button className="btn-gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Colleague
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 glass-card">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="colleagues" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
                Colleagues
              </TabsTrigger>
              <TabsTrigger value="transactions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
                Transactions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Summary Cards */}
                <Card className="glass-card border-0 scale-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">Total Contributions</h3>
                      <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gradient-primary mb-2">$27,300</p>
                    <p className="text-sm text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>

                <Card className="glass-card border-0 scale-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">Total Withdrawals</h3>
                      <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 text-white">
                        <ArrowDownRight className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-red-500 mb-2">$8,000</p>
                    <p className="text-sm text-muted-foreground">-5% from last month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Activity Overview */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTransactions.slice(0, 3).map((transaction, index) => (
                      <div key={transaction.id} className={`flex items-center gap-4 p-4 rounded-lg glass-card scale-hover fade-in fade-in-delay-${index + 1}`}>
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'contribution' 
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-500' 
                            : 'bg-gradient-to-br from-red-500 to-pink-500'
                        } text-white`}>
                          {transaction.type === 'contribution' ? 
                            <TrendingUp className="w-4 h-4" /> : 
                            <TrendingDown className="w-4 h-4" />
                          }
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{transaction.colleague}</p>
                          <p className="text-sm text-muted-foreground">{transaction.description}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            transaction.type === 'contribution' ? 'text-emerald-500' : 'text-red-500'
                          }`}>
                            {transaction.type === 'contribution' ? '+' : '-'}${transaction.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">{transaction.asset}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="colleagues" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockColleagues.map((colleague, index) => (
                  <Card key={colleague.id} className={`glass-card border-0 scale-hover fade-in fade-in-delay-${index + 1}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                          {colleague.avatar}
                        </div>
                        <div>
                          <h3 className="font-semibold">{colleague.name}</h3>
                          <Badge variant={colleague.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {colleague.status}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Net Contribution</span>
                          <span className="font-semibold text-gradient-primary">${colleague.netContribution.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Total In</span>
                          <span className="font-medium text-emerald-500">${colleague.totalContributions.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Total Out</span>
                          <span className="font-medium text-red-500">${colleague.totalWithdrawals.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-border">
                          <span className="text-sm text-muted-foreground">Last Activity</span>
                          <span className="text-sm">{colleague.lastActivity}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="mt-6">
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Transaction History</CardTitle>
                  <CardDescription>
                    Complete record of all contributions and withdrawals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTransactions.map((transaction, index) => (
                      <div key={transaction.id} className={`flex items-center gap-4 p-4 rounded-lg glass-card scale-hover fade-in fade-in-delay-${index + 1}`}>
                        <div className={`p-3 rounded-full ${
                          transaction.type === 'contribution' 
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-500' 
                            : 'bg-gradient-to-br from-red-500 to-pink-500'
                        } text-white`}>
                          {transaction.type === 'contribution' ? 
                            <TrendingUp className="w-5 h-5" /> : 
                            <TrendingDown className="w-5 h-5" />
                          }
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{transaction.colleague}</h4>
                            <Badge variant="outline" className="text-xs">
                              {transaction.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{transaction.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {transaction.date}
                            <span>•</span>
                            <span>{transaction.asset}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-xl font-bold ${
                            transaction.type === 'contribution' ? 'text-emerald-500' : 'text-red-500'
                          }`}>
                            {transaction.type === 'contribution' ? '+' : '-'}${transaction.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
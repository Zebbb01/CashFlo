// src/components/financial-management/ColleaguesContributions/ColleaguesOverviewTab.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
// Import the new PartnershipTransaction type
import { Asset, PartnershipTransaction } from "@/types"; // Assuming you export it from types/index.ts or financial.ts

interface ColleaguesOverviewTabProps {
  activeTab: string;
  totalContributionsOverview: number;
  totalWithdrawalsOverview: number;
  // Change the prop type to the new unified PartnershipTransaction[]
  allPartnershipTransactions: PartnershipTransaction[];
  colleaguesData: any[]; // Consider creating a specific type for colleague data (e.g., { id: string; name: string; }[])
  userAssets: Asset[];
}

export function ColleaguesOverviewTab({
  activeTab,
  totalContributionsOverview,
  totalWithdrawalsOverview,
  allPartnershipTransactions, // Renamed for clarity
  colleaguesData,
  userAssets,
}: ColleaguesOverviewTabProps) {
  return (
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
            <p className="text-3xl font-bold text-gradient-primary mb-2">₱{totalContributionsOverview.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Across all managed assets</p>
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
            <p className="text-3xl font-bold text-red-500 mb-2">₱{totalWithdrawalsOverview.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Across all managed assets</p>
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
            {allPartnershipTransactions.length > 0 ? (
              allPartnershipTransactions.slice(0, 5).map((transaction, index) => {
                // Determine transaction type directly from the 'type' property
                const isContribution = transaction.type === 'contribution';

                // Safely access description, source, or category based on type
                const displayDescription = transaction.description ||
                                           (isContribution ? transaction.source : transaction.category) ||
                                           'N/A'; // Fallback if no description, source, or category

                return (
                  <div key={transaction.id} className={`flex items-center gap-4 p-4 rounded-lg glass-card scale-hover fade-in fade-in-delay-₱{index + 1}`}>
                    <div className={`p-3 rounded-full ${
                      isContribution
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-500' // Green for contribution
                        : 'bg-gradient-to-br from-red-500 to-pink-500' // Red for withdrawal
                    } text-white`}>
                      {isContribution ?
                        <TrendingUp className="w-5 h-5" /> :
                        <TrendingDown className="w-5 h-5" />
                      }
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">
                          Colleague: {colleaguesData.find(c => c.id === transaction.userId)?.name || 'N/A'}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {isContribution ? 'Contribution' : 'Withdrawal'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {displayDescription}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(transaction.date).toLocaleDateString()}
                        <span>•</span>
                        <span>Asset: {userAssets.find(asset => asset.id === transaction.bankAssetManagementId)?.assetName || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ₱{
                        isContribution ? 'text-emerald-500' : 'text-red-500'
                      }`}>
                        {isContribution ? '+' : '-'}₱{transaction.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-center py-8">No recent transactions found for this colleague or asset.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
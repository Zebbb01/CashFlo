// src/components/financial-management/ColleaguesContributions/TransactionHistoryTab.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";
// Import the new PartnershipTransaction type and Asset
import { PartnershipTransaction, Asset } from "@/types";

interface TransactionHistoryTabProps {
  activeTab: string;
  // Change the prop type to the new unified PartnershipTransaction[]
  allPartnershipTransactions: PartnershipTransaction[];
  colleaguesData: any[]; // Consider creating a specific type for colleague data (e.g., { id: string; name: string; }[])
  userAssets: Asset[];
}

export function TransactionHistoryTab({
  allPartnershipTransactions, // Renamed to match the new prop name
  colleaguesData,
  userAssets,
}: TransactionHistoryTabProps) {
  return (
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
            {allPartnershipTransactions.length > 0 ? (
              allPartnershipTransactions.map((transaction, index) => {
                // Determine transaction type directly from the 'type' property
                const isContribution = transaction.type === 'contribution';
                const isWithdrawal = transaction.type === 'withdrawal'; // Explicitly check for withdrawal

                // Safely access description, source, or category based on type
                const displayDescription = transaction.description ||
                                           (isContribution ? transaction.source : transaction.type === 'withdrawal' ? transaction.category : undefined) ||
                                           'N/A'; // Fallback if no description, source, or category

                return (
                  <div key={transaction.id} className={`flex items-center gap-4 p-4 rounded-lg glass-card scale-hover fade-in fade-in-delay-₱{index + 1}`}>
                    <div className={`p-3 rounded-full ${
                      isContribution
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-500' // Green for contribution
                        : isWithdrawal
                        ? 'bg-gradient-to-br from-red-500 to-pink-500' // Red for withdrawal
                        : 'bg-gray-300' // Fallback for other potential types, or if neither contribution/withdrawal
                    } text-white`}>
                      {isContribution ?
                        <TrendingUp className="w-5 h-5" /> :
                        isWithdrawal ?
                        <TrendingDown className="w-5 h-5" /> :
                        null // Or a default icon if neither
                      }
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">
                          Colleague: {colleaguesData.find(c => c.id === transaction.userId)?.name || 'N/A'}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {isContribution ? 'Contribution' : isWithdrawal ? 'Withdrawal' : 'Other Transaction'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{displayDescription}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(transaction.date).toLocaleDateString()}
                        <span>•</span>
                        <span>Asset: {userAssets.find(asset => asset.id === transaction.bankAssetManagementId)?.assetName || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ₱{
                        isContribution ? 'text-emerald-500' : isWithdrawal ? 'text-red-500' : 'text-gray-500'
                      }`}>
                        {isContribution ? '+' : isWithdrawal ? '-' : ''}₱{transaction.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-center py-8">No transactions found for this asset.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
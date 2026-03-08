// src/components/financial-management/ColleaguesContributions/ColleaguesListTab.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Asset } from "@/types"; // Import Asset type

interface ColleaguesListTabProps {
  activeTab: string;
  colleaguesData: any[]; // Consider creating a specific type for colleague data
  currentUserId: string;
  defaultAssetId: string;
  userAssets: Asset[];
  setSelectedAssetForManagement: (asset: any) => void;
  setIsColleagueModalOpen: (isOpen: boolean) => void;
}

export function ColleaguesListTab({
  activeTab,
  colleaguesData,
  currentUserId,
  defaultAssetId,
  userAssets,
  setSelectedAssetForManagement,
  setIsColleagueModalOpen,
}: ColleaguesListTabProps) {
  return (
    <TabsContent value="colleagues" className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {colleaguesData.length > 0 ? (
          colleaguesData.map((colleague, index) => (
            <Card key={colleague.id} className={`glass-card border-0 scale-hover fade-in fade-in-delay-₱{index + 1}`}>
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
                  {/* Only show "More" button if the current user owns the asset
                      OR if it's the current user themselves (to leave partnership, if applicable) */}
                  {(defaultAssetId && userAssets.find(asset => asset.id === defaultAssetId)?.userId === currentUserId) || (colleague.id === currentUserId) ? (
                    <Button variant="ghost" size="sm" className="ml-auto" onClick={() => {
                      // If clicked on current user's own card, pass current user's asset
                      const assetToManage = userAssets.find(asset => asset.id === defaultAssetId);
                      if (assetToManage) {
                        setSelectedAssetForManagement(assetToManage);
                        setIsColleagueModalOpen(true);
                      } else {
                        toast.info("No Asset Selected", { description: "Please select an asset to manage its partners." });
                      }
                    }}>
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  ) : null}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Net Contribution</span>
                    <span className="font-semibold text-gradient-primary">₱{colleague.netContribution.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total In</span>
                    <span className="font-medium text-emerald-500">₱{colleague.totalContributions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Out</span>
                    <span className="font-medium text-red-500">₱{colleague.totalWithdrawals.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="text-sm text-muted-foreground">Last Activity</span>
                    <span className="text-sm">{colleague.lastActivity}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground col-span-full text-center py-8">No colleagues found for this asset.</p>
        )}
      </div>
    </TabsContent>
  );
}
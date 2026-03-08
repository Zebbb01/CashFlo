// src/app/dashboard/(financial-management)/financial-colleagues/page.tsx
"use client";

import { Separator } from "@/components/ui/separator";
import { ColleaguesContributions } from "@/components/financial-management/colleagues-contributions/ColleaguesContributions"; // Updated import path
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign } from "lucide-react";
import { useFinancialTotals } from "@/hooks/financial-management/useRevenueCost";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { useAssets } from "@/hooks/financial-management/useAssets"; // Assuming this is the correct hook for all assets
import { useQuery } from "@tanstack/react-query";
import { AssetPartnership } from "@/types";
import { fetchAssetPartnershipsByAssetApi } from "@/lib/api-clients/partnership-api";
import React from "react"; // Explicitly import React for useMemo


export default function FinancialColleaguesPage() {
  const { data: session } = useSession();
  const userId = session?.user.id;

  // Assuming totalRevenue and totalCosting are globally aggregated or per-user.
  const { totalRevenue, totalCosting, totalAssets, isLoading: isLoadingTotals, error: totalsError } = useFinancialTotals();

  // Fetch all assets associated with the current user.
  const { data: userAssets, isLoading: isLoadingUserAssets } = useAssets();

  // New approach: Fetch partnerships for each of the user's owned assets to count active colleagues globally
  const {
    data: allAssetPartnershipsAcrossOwnedAssets, // Renamed for clarity on what it contains
    isLoading: isLoadingAllPartnerships,
    error: allPartnershipsError,
  } = useQuery<AssetPartnership[], Error>({
    queryKey: ['allActiveColleaguesPartnerships', userId],
    queryFn: async () => {
      if (!userId || !userAssets?.length) {
        return [];
      }

      // Filter to only include assets *owned by the current user*
      const ownedAssets = userAssets.filter(asset => asset.userId === userId);

      if (ownedAssets.length === 0) {
        return []; // No owned assets, no partnerships to count for active colleagues
      }

      // Fetch partnerships for each owned asset in parallel
      const partnershipPromises = ownedAssets.map(asset =>
        fetchAssetPartnershipsByAssetApi(asset.id)
      );

      const allPartnershipArrays = await Promise.all(partnershipPromises);
      return allPartnershipArrays.flat();
    },
    enabled: !!userId && !isLoadingUserAssets && ((userAssets?.length ?? 0) > 0),
    staleTime: 5 * 60 * 1000,
  });

  // Calculate active colleagues from the aggregated partnerships
  const activeColleaguesCount = React.useMemo(() => {
    if (!allAssetPartnershipsAcrossOwnedAssets) return 0;

    // Use a Set to store unique user IDs to avoid double-counting
    const uniqueActiveColleagueIds = new Set<string>();
    allAssetPartnershipsAcrossOwnedAssets.forEach((partnership: AssetPartnership) => {
      // Ensure the partnership is active and the partner is not the current user themselves
      if (partnership.isActive && partnership.userId !== userId) {
        uniqueActiveColleagueIds.add(partnership.userId);
      }
    });
    return uniqueActiveColleagueIds.size;
  }, [allAssetPartnershipsAcrossOwnedAssets, userId]);


  const totalContributions = totalRevenue;
  const totalWithdrawals = totalCosting;

  const growthRate = ((totalRevenue - totalCosting) / (totalCosting || 1)) * 100;

  return (
    <div className="flex-1 overflow-auto p-4 relative">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl floating pulse-glow"></div>
        <div className="absolute top-40 right-32 w-48 h-48 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl floating" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-56 h-56 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header Section with Animations */}
        <div className="fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white floating">
              <Users className="w-6 h-6" />
            </div>
            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition-all duration-300">
              <TrendingUp className="w-3 h-3 mr-1" />
              New Feature
            </Badge>
          </div>

          <h1 className="text-3xl font-bold text-gradient-primary mb-2">
            Colleagues & Financial Contributions
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your assets, track revenue and costs, and handle withdrawals with your team.
          </p>
        </div>

        <div className="fade-in fade-in-delay-1">
          <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-in fade-in-delay-2">
          <div className="glass-card p-6 rounded-xl scale-hover">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">Active Colleagues</h3>
            </div>
            <p className="text-2xl font-bold text-gradient-primary">{activeColleaguesCount}</p>
            <p className="text-sm text-muted-foreground">Number of active partners</p>
          </div>

          <div className="glass-card p-6 rounded-xl scale-hover">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">Total Contributions</h3>
            </div>
            <p className="text-2xl font-bold text-gradient-secondary">₱{totalContributions.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Overall revenue generated</p>
          </div>

          <div className="glass-card p-6 rounded-xl scale-hover">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">Net Growth</h3>
            </div>
            <p className={`text-2xl font-bold ${growthRate >= 0 ? 'text-gradient-accent' : 'text-red-500'}`}>
              {growthRate.toFixed(2)}%
            </p>
            <p className="text-sm text-muted-foreground">Based on total revenue vs. total cost</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="fade-in fade-in-delay-3">
          <ColleaguesContributions currentUserId={userId || ''} />
        </div>
      </div>
    </div>
  );
}
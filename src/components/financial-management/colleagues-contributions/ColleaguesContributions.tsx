// src/components/financial-management/ColleaguesContributions/ColleaguesContributions.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useAssets } from "@/hooks/financial-management/useAssets";
import { useUsers } from "@/hooks/auth/useUsers";
import { ColleagueManagementModal } from "@/components/financial-management/modals/ColleagueManagementModals/ColleagueManagementModal";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AssetPartnership, PartnershipTransaction } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { fetchAssetPartnershipsByAssetApi } from "@/lib/api-clients/partnership-api";

// Import the new tab components
import { ColleaguesOverviewTab } from "./ColleaguesOverviewTab";
import { ColleaguesListTab } from "./ColleaguesListTab";
import { TransactionHistoryTab } from "./TransactionHistoryTab";
// No need to import PartnershipService directly here, as it's a backend service.

interface ColleaguesContributionsProps {
  currentUserId: string;
}

export function ColleaguesContributions({ currentUserId }: ColleaguesContributionsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isColleagueModalOpen, setIsColleagueModalOpen] = useState(false);
  const [selectedAssetForManagement, setSelectedAssetForManagement] = useState<any | null>(null);

  // Fetch all assets associated with the current user.
  const { data: userAssets, isLoading: isLoadingUserAssets } = useAssets();

  // Determine a default asset ID for displaying partnerships and filtering transactions.
  const defaultAssetId = useMemo(() => {
    const ownedAsset = userAssets?.find(asset => asset.userId === currentUserId);
    return ownedAsset?.id || '';
  }, [userAssets, currentUserId]);

  // Fetch all asset partnerships relevant to the current user's *owned* assets.
  const {
    data: allAssetPartnershipsData,
    isLoading: isLoadingAllPartnerships,
    error: allPartnershipsError,
  } = useQuery<AssetPartnership[], Error>({
    queryKey: ['allOwnedAssetPartnerships', currentUserId, defaultAssetId],
    queryFn: async () => {
      if (!currentUserId || !userAssets?.length) {
        return [];
      }

      const ownedAssets = userAssets.filter(asset => asset.userId === currentUserId);
      if (ownedAssets.length === 0) {
        return [];
      }

      // Fetch partnerships for each *owned* asset in parallel
      const partnershipPromises = ownedAssets.map(async asset => {
        const data = await fetchAssetPartnershipsByAssetApi(asset.id);
        return data;
      });

      const allPartnershipArrays = await Promise.all(partnershipPromises);
      return allPartnershipArrays.flat();
    },
    enabled: !!currentUserId && !isLoadingUserAssets && ((userAssets?.length ?? 0) > 0),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch all users for colleague names
  const { data: allUsers, isLoading: isLoadingUsers } = useUsers();

  // --- NEW AGGREGATED TRANSACTIONS LOGIC ---
  // Fetch ALL partnership transactions for all assets owned by the current user
  // This will be a single, aggregated API call.
  const {
    data: allColleagueTransactionsData,
    isLoading: isLoadingColleagueTransactions,
    error: colleagueTransactionsError
  } = useQuery<PartnershipTransaction[], Error>({
    queryKey: ['allColleaguePartnershipTransactions', currentUserId], // Key based on current user only
    queryFn: async () => {
      // We'll call a new, dedicated endpoint that fetches all transactions
      // relevant to the current user's owned assets and their partners.
      const response = await fetch(`/api/asset-management/all-partner-transactions?currentUserId=${currentUserId}`);
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch all colleague transactions.`);
      }
      const data = await response.json();
      return data.allPartnershipTransactions || [];
    },
    // This query is enabled as soon as we have a currentUserId.
    // It will fetch all relevant transactions without needing individual partnership data first.
    enabled: !!currentUserId,
    staleTime: 5 * 60 * 1000,
  });

  // Calculate totals for the overview tab from the combined transactions
  const totalContributionsOverview = useMemo(() => {
    return (allColleagueTransactionsData || []).filter(t => t.type === 'contribution').reduce((sum, tx) => sum + tx.amount, 0);
  }, [allColleagueTransactionsData]);

  const totalWithdrawalsOverview = useMemo(() => {
    return (allColleagueTransactionsData || []).filter(t => t.type === 'withdrawal').reduce((sum, tx) => sum + tx.amount, 0);
  }, [allColleagueTransactionsData]);

  // Prepare colleagues data for display in the Colleagues tab
  const colleaguesData = useMemo(() => {
    if (!allAssetPartnershipsData || !allColleagueTransactionsData || !allUsers) return [];

    const processedColleagues: any[] = [];
    const uniqueColleaguePartnerships = new Map<string, AssetPartnership>(); // Use Map to store unique colleagues, keeping one partnership instance

    // First, gather unique colleagues and their *primary* partnership
    // This should ideally be partnerships where the *current user* is the owner of the asset
    // and the partner is someone else.
    allAssetPartnershipsData.forEach(p => {
        // Only include partners who are *not* the current user and where the asset is owned by the current user
        const isOwnedAsset = userAssets?.some(asset => asset.id === p.assetId && asset.userId === currentUserId);
        if (p.userId !== currentUserId && isOwnedAsset) {
            // Add if not already processed. For simplicity, we just add the first instance found.
            if (!uniqueColleaguePartnerships.has(p.userId)) {
                uniqueColleaguePartnerships.set(p.userId, p);
            }
        }
    });

    uniqueColleaguePartnerships.forEach((partnership, colleagueId) => {
        // Filter transactions for *this specific colleague* and *this specific asset* if needed for accurate totals
        // For the "Colleagues" list, if a colleague is part of multiple assets, you might want to show
        // their total contributions across ALL owned assets, or just for the default one.
        // Given the original context, let's calculate totals for transactions related to this *specific partnership*.
        const colleagueRevenues = (allColleagueTransactionsData || []).filter(
            tx => tx.userId === colleagueId && tx.type === 'contribution' && tx.bankAssetManagementId === partnership.assetId
        );
        const colleagueCosts = (allColleagueTransactionsData || []).filter(
            tx => tx.userId === colleagueId && tx.type === 'withdrawal' && tx.bankAssetManagementId === partnership.assetId
        );

        const totalContributions = colleagueRevenues.reduce((sum, tx) => sum + tx.amount, 0);
        const totalWithdrawals = colleagueCosts.reduce((sum, tx) => sum + tx.amount, 0);
        const netContribution = totalContributions - totalWithdrawals;

        const allColleagueTransactionsForPartnership = [...colleagueRevenues, ...colleagueCosts];

        const lastActivityTimestamp = allColleagueTransactionsForPartnership.length > 0
            ? Math.max(...allColleagueTransactionsForPartnership.map(tx => new Date(tx.date).getTime()))
            : 0;
        const lastActivity = lastActivityTimestamp ? new Date(lastActivityTimestamp).toLocaleDateString() : 'N/A';

        const userDetail = allUsers?.find(user => user.id === colleagueId);

        processedColleagues.push({
            id: colleagueId,
            name: userDetail?.name || userDetail?.email || 'Unknown Colleague',
            avatar: userDetail?.name ? userDetail.name.split(' ').map(n => n[0]).join('').toUpperCase() : (userDetail?.email?.[0]?.toUpperCase() || '??'),
            totalContributions: totalContributions,
            totalWithdrawals: totalWithdrawals,
            netContribution: netContribution,
            lastActivity: lastActivity,
            status: partnership.isActive ? 'active' : 'inactive',
            assetId: partnership.assetId, // Store the assetId from the partnership
        });
    });

    return processedColleagues;
  }, [allAssetPartnershipsData, allColleagueTransactionsData, allUsers, currentUserId, userAssets]);


  const isLoading = isLoadingAllPartnerships || isLoadingColleagueTransactions || isLoadingUserAssets || isLoadingUsers;
  const error = allPartnershipsError || colleagueTransactionsError;


  const handleAddColleagueClick = () => {
    if (userAssets && userAssets.length > 0) {
      const ownedAssets = userAssets.filter(asset => asset.userId === currentUserId);
      const firstOwnedAsset = ownedAssets[0];

      if (firstOwnedAsset) {
        setSelectedAssetForManagement(firstOwnedAsset);
        setIsColleagueModalOpen(true);
      } else {
        toast.info("No Owned Assets", { description: "You don't own any assets to add colleagues to yet. Create an asset first!" });
      }
    } else {
      toast.info("No Assets Available", { description: "You need to have at least one asset to manage colleagues." });
    }
  };


  if (isLoading) {
    return (
      <Card className="glass-card border-0 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-5 w-96" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="w-24 h-9 rounded-md" />
              <Skeleton className="w-32 h-9 rounded-md" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-10 mb-6" />
          <Tabs value={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 glass-card">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </TabsList>
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="glass-card border-0 scale-hover h-40" />
                <Skeleton className="glass-card border-0 scale-hover h-40" />
              </div>
              <Skeleton className="glass-card border-0 h-80" />
            </div>
          </Tabs>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-card border-0 shadow-2xl">
        <CardContent className="p-6 text-red-500">
          Error loading data: {error.message}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
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
              <Button className="btn-gradient-primary" onClick={handleAddColleagueClick}>
                <Plus className="w-4 h-4 mr-2" />
                Add Colleague
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
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

            <ColleaguesOverviewTab
              activeTab={activeTab}
              totalContributionsOverview={totalContributionsOverview}
              totalWithdrawalsOverview={totalWithdrawalsOverview}
              allPartnershipTransactions={allColleagueTransactionsData || []}
              colleaguesData={colleaguesData}
              userAssets={userAssets || []}
            />

            <ColleaguesListTab
              activeTab={activeTab}
              colleaguesData={colleaguesData}
              currentUserId={currentUserId}
              defaultAssetId={defaultAssetId}
              userAssets={userAssets || []}
              setSelectedAssetForManagement={setSelectedAssetForManagement}
              setIsColleagueModalOpen={setIsColleagueModalOpen}
            />

            <TransactionHistoryTab
              activeTab={activeTab}
              allPartnershipTransactions={allColleagueTransactionsData || []}
              colleaguesData={colleaguesData}
              userAssets={userAssets || []}
            />

          </Tabs>
        </CardContent>
      </Card>

      {selectedAssetForManagement && (
        <ColleagueManagementModal
          isOpen={isColleagueModalOpen}
          onClose={() => setIsColleagueModalOpen(false)}
          selectedAsset={selectedAssetForManagement}
          users={allUsers || []}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
}
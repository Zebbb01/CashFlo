'use client';

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react"; // NEW: Import useSession

// Hooks
import {
  useAssets,
  useDeleteAsset,
  useUpdateAsset,
} from "@/hooks/financial-management/useAssets";
import { useCompanies } from "@/hooks/financial-management/useCompanies";
import { useBanks } from "@/hooks/financial-management/useBanks";
import { useUserInvitations } from "@/hooks/financial-management/useInvitations";
import { useUsers } from "@/hooks/auth/useUsers";

// Types
import { Asset } from "@/types";

// Nested Components
import { AssetTableSection } from "./asset-management/asset-table-section";
import { BankTableSection } from "./asset-management/bank-table-section";
import { AssetModals } from "./asset-management/assets-modals-summary";
import { ColleagueManagementModal } from "./modals/ColleagueManagementModals/ColleagueManagementModal";
import { InvitationsModal } from "./modals/InvitationModals/InvitationsModal";
import { DeleteAssetAlertDialog } from "./dialogs/delete-asset-alert-dialog";

export function AssetManagement() {
  const { data: session, status } = useSession();
  const currentUserId = session?.user?.id || '';

  useEffect(() => {
    if (currentUserId) {
      console.log("Current User ID (Receiver):", currentUserId);
    }
  }, [currentUserId]);

  // State for general modals
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isEditAssetModalOpen, setIsEditAssetModalOpen] = useState(false);
  const [isViewAssetModalOpen, setIsViewAssetModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // State for delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [assetToDeleteId, setAssetToDeleteId] = useState<string | null>(null);

  // State for Colleague/Partnership Management
  const [isManageColleaguesModalOpen, setIsManageColleaguesModalOpen] = useState(false);
  const [selectedAssetForColleagues, setSelectedAssetForColleagues] = useState<Asset | null>(null);

  // State for Invitation Management
  const [isViewInvitationsModalOpen, setIsViewInvitationsModalOpen] = useState(false);

  // Data Hooks
  const { data: assets, isLoading: isLoadingAssets, error: assetsError } = useAssets();
  const { data: companies, isLoading: isLoadingCompanies, error: companiesError } = useCompanies();
  const { data: banks, isLoading: isLoadingBanks, error: banksError } = useBanks();
  const { data: users, isLoading: isLoadingUsers, error: usersError } = useUsers();
  const { data: userInvitations, isLoading: isLoadingUserInvitations } = useUserInvitations(currentUserId, 'received');

  // Mutation Hooks
  const updateAssetMutation = useUpdateAsset();
  const deleteAssetMutation = useDeleteAsset();

  // Error Handling
  useEffect(() => {
    if (assetsError) {
      toast.error("Error fetching assets", { description: assetsError.message });
    }
    if (companiesError) {
      toast.error("Error fetching companies", { description: companiesError.message });
    }
    if (banksError) {
      toast.error("Error fetching banks", { description: banksError.message });
    }
    if (usersError) {
      toast.error("Error fetching users", { description: usersError.message });
    }
  }, [assetsError, companiesError, banksError, usersError]);

  // Handlers for Asset Actions
  const handleToggleSoftDelete = async (asset: Asset) => {
    try {
      await updateAssetMutation.mutateAsync({
        id: asset.id,
        payload: { softDelete: asset.deletedAt === null ? true : false },
      });
      toast.info("Asset Status Updated", {
        description: `Asset "${asset.assetName}" ${asset.deletedAt === null ? "soft-deleted" : "restored"}.`,
      });
    } catch (error: any) {
      toast.error("Failed to update asset status", {
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  const handleDeleteClick = (assetId: string) => {
    setAssetToDeleteId(assetId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!assetToDeleteId) return;
    try {
      await deleteAssetMutation.mutateAsync(assetToDeleteId);
      toast.success("Asset Deleted", { description: "The asset has been permanently deleted." });
      setIsDeleteDialogOpen(false);
      setAssetToDeleteId(null);
    } catch (error: any) {
      toast.error("Failed to delete asset", { description: error.message || "An unexpected error occurred." });
      setIsDeleteDialogOpen(false);
      setAssetToDeleteId(null);
    }
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsEditAssetModalOpen(true);
  };

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsViewAssetModalOpen(true);
  };

  const handleManageColleagues = (asset: Asset) => {
    setSelectedAssetForColleagues(asset);
    setIsManageColleaguesModalOpen(true);
  };

  const handleViewInvitations = () => {
    setIsViewInvitationsModalOpen(true);
  };

  // If session is still loading, you might want to show a loading state for the whole component
  if (status === "loading") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Asset Management</CardTitle>
          <CardDescription>Loading user session...</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please wait while we load your session data.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Management</CardTitle>
        <CardDescription>Add and track your assets, associated companies, and banks.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button variant='outline' onClick={() => setIsCompanyModalOpen(true)}>Add New Company</Button>
          <Button variant='outline' onClick={() => setIsAssetModalOpen(true)}>Add New Asset</Button>
          <Button variant='outline' onClick={() => setIsBankModalOpen(true)}>Add New Bank</Button>
          <Button variant='outline' onClick={handleViewInvitations} disabled={isLoadingUserInvitations || !currentUserId}>
            View My Invitations ({userInvitations?.length || 0})
          </Button>
        </div>

        <AssetTableSection
          assets={assets || []}
          isLoadingAssets={isLoadingAssets}
          isLoadingCompanies={isLoadingCompanies}
          isLoadingBanks={isLoadingBanks}
          isLoadingUsers={isLoadingUsers}
          handleEditAsset={handleEditAsset}
          handleViewAsset={handleViewAsset}
          handleManageColleagues={handleManageColleagues}
          handleToggleSoftDelete={handleToggleSoftDelete}
          handleDeleteClick={handleDeleteClick}
          updateAssetMutationIsPending={updateAssetMutation.isPending}
          currentUserId={currentUserId}
        />

        <Separator className="mt-8" />

        <BankTableSection
          banks={banks || []}
          isLoadingBanks={isLoadingBanks}
        />
      </CardContent>

      {/* Modals */}
      <AssetModals
        isCompanyModalOpen={isCompanyModalOpen}
        setIsCompanyModalOpen={setIsCompanyModalOpen}
        isAssetModalOpen={isAssetModalOpen}
        setIsAssetModalOpen={setIsAssetModalOpen}
        isEditAssetModalOpen={isEditAssetModalOpen}
        setIsEditAssetModalOpen={setIsEditAssetModalOpen}
        isViewAssetModalOpen={isViewAssetModalOpen}
        setIsViewAssetModalOpen={setIsViewAssetModalOpen}
        isBankModalOpen={isBankModalOpen}
        setIsBankModalOpen={setIsBankModalOpen}
        selectedAsset={selectedAsset}
        companies={companies || []}
        banks={banks || []}
        users={users || []}
        isLoadingUsers={isLoadingUsers}
      />

      <ColleagueManagementModal
        isOpen={isManageColleaguesModalOpen}
        onClose={() => setIsManageColleaguesModalOpen(false)}
        selectedAsset={selectedAssetForColleagues}
        users={users || []}
        currentUserId={currentUserId}
      />

      <InvitationsModal
        isOpen={isViewInvitationsModalOpen}
        onClose={() => setIsViewInvitationsModalOpen(false)}
        currentUserId={currentUserId}
      />

      <DeleteAssetAlertDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Card>
  );
}

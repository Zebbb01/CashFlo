'use client';

import React from 'react';
import { AddCompanyModal } from "../modals/AssetManagementModals/AddCompanyModal";
import { AddAssetModal } from "../modals/AssetManagementModals/AddAssetModal";
import { EditAssetModal } from "../modals/AssetManagementModals/EditAssetModal";
import { ViewAssetModal } from "../modals/AssetManagementModals/ViewAssetModal";
import { AddBankModal } from "../modals/AssetManagementModals/AddBankModal";
import { Asset, Company, Bank, User } from "@/types";

interface AssetModalsProps {
  isCompanyModalOpen: boolean;
  setIsCompanyModalOpen: (isOpen: boolean) => void;
  isAssetModalOpen: boolean;
  setIsAssetModalOpen: (isOpen: boolean) => void;
  isEditAssetModalOpen: boolean;
  setIsEditAssetModalOpen: (isOpen: boolean) => void;
  isViewAssetModalOpen: boolean;
  setIsViewAssetModalOpen: (isOpen: boolean) => void;
  isBankModalOpen: boolean;
  setIsBankModalOpen: (isOpen: boolean) => void;
  selectedAsset: Asset | null;
  companies: Company[];
  banks: Bank[];
  users: User[];
  isLoadingUsers: boolean; // Pass isLoadingUsers to Add/Edit Asset Modals
}

export function AssetModals({
  isCompanyModalOpen,
  setIsCompanyModalOpen,
  isAssetModalOpen,
  setIsAssetModalOpen,
  isEditAssetModalOpen,
  setIsEditAssetModalOpen,
  isViewAssetModalOpen,
  setIsViewAssetModalOpen,
  isBankModalOpen,
  setIsBankModalOpen,
  selectedAsset,
  companies,
  banks,
  users,
  isLoadingUsers,
}: AssetModalsProps) {
  return (
    <>
      <AddCompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
      />
      <AddAssetModal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        companies={companies || []}
        banks={banks || []}
        users={users || []}
        isLoadingUsers={isLoadingUsers} // Pass the prop
      />
      <EditAssetModal
        isOpen={isEditAssetModalOpen}
        onClose={() => setIsEditAssetModalOpen(false)}
        asset={selectedAsset}
        companies={companies || []}
        banks={banks || []}
        users={users || []}
        isLoadingUsers={isLoadingUsers} // Pass the prop
      />
      <ViewAssetModal
        isOpen={isViewAssetModalOpen}
        onClose={() => setIsViewAssetModalOpen(false)}
        asset={selectedAsset}
      />
      <AddBankModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
      />
    </>
  );
}

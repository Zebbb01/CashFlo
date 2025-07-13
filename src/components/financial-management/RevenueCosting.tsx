// src/components/financial-management/RevenueCosting.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  useFinancialTotals,
  useRevenues,
  useCosts,
  useDeleteRevenue,
  useDeleteCost,
} from "@/hooks/financial-management/useRevenueCost";
import { Revenue, Cost } from "@/types";
import { useUsers } from "@/hooks/auth/useUsers";

// Import new modular components
import { RevenueCostingSummary } from "./revenue-costing/revenue-costing-summary";
import { RevenueSection } from "./revenue-costing/revenue-section";
import { CostSection } from "./revenue-costing/cost-section";
import { DeleteConfirmationDialog } from "./dialogs/delete-confirmation-dialog"; // New generic dialog

// Import all modal components
import { AddRevenueModal } from "./modals/RevenueCostingModals/AddRevenueModal";
import { AddCostModal } from "./modals/RevenueCostingModals/AddCostModal";
import { EditRevenueModal } from "./modals/RevenueCostingModals/EditRevenueModal";
import { ViewRevenueModal } from "./modals/RevenueCostingModals/ViewRevenueModal";
import { EditCostModal } from "./modals/RevenueCostingModals/EditCostModal";
import { ViewCostModal } from "./modals/RevenueCostingModals/ViewCostModal";

export function RevenueCosting() {
  // Data fetching hooks
  const { totalAssets, totalRevenue, totalCosting, netProfit, isLoading, error } = useFinancialTotals();
  const { data: revenues, isLoading: isLoadingRevenues, error: revenuesError } = useRevenues();
  const { data: costs, isLoading: isLoadingCosts, error: costsError } = useCosts();
  const { data: users, isLoading: areUsersLoading, error: usersError } = useUsers();

  // State for modals
  const [isAddRevenueModalOpen, setIsAddRevenueModalOpen] = useState(false);
  const [isAddCostModalOpen, setIsAddCostModalOpen] = useState(false);
  const [isEditRevenueModalOpen, setIsEditRevenueModalOpen] = useState(false);
  const [isViewRevenueModalOpen, setIsViewRevenueModalOpen] = useState(false);
  const [isEditCostModalOpen, setIsEditCostModalOpen] = useState(false);
  const [isViewCostModalOpen, setIsViewCostModalOpen] = useState(false);

  const [selectedRevenue, setSelectedRevenue] = useState<Revenue | null>(null);
  const [selectedCost, setSelectedCost] = useState<Cost | null>(null);

  // State for delete confirmation dialogs
  const [isDeleteRevenueDialogOpen, setIsDeleteRevenueDialogOpen] = useState(false);
  const [revenueToDeleteId, setRevenueToDeleteId] = useState<string | null>(null);
  const [isDeleteCostDialogOpen, setIsDeleteCostDialogOpen] = useState(false);
  const [costToDeleteId, setCostToDeleteId] = useState<string | null>(null);

  // Mutations
  const deleteRevenueMutation = useDeleteRevenue();
  const deleteCostMutation = useDeleteCost();

  useEffect(() => {
    if (error || revenuesError || costsError || usersError) {
      toast.error("Error fetching financial data", {
        description: error?.message || revenuesError?.message || costsError?.message || usersError?.message,
      });
    }
  }, [error, revenuesError, costsError, usersError]);

  // Handlers for Revenue actions
  const handleEditRevenue = (revenue: Revenue) => {
    setSelectedRevenue(revenue);
    setIsEditRevenueModalOpen(true);
  };

  const handleViewRevenue = (revenue: Revenue) => {
    setSelectedRevenue(revenue);
    setIsViewRevenueModalOpen(true);
  };

  const handleDeleteRevenueClick = (revenueId: string) => {
    setRevenueToDeleteId(revenueId);
    setIsDeleteRevenueDialogOpen(true);
  };

  const handleConfirmDeleteRevenue = async () => {
    if (!revenueToDeleteId) return;
    try {
      await deleteRevenueMutation.mutateAsync(revenueToDeleteId);
      toast.success("Revenue Deleted", { description: "Revenue entry permanently deleted." });
      setIsDeleteRevenueDialogOpen(false);
      setRevenueToDeleteId(null);
    } catch (err: any) {
      toast.error("Failed to delete revenue", { description: err.message || "An unexpected error occurred." });
      setIsDeleteRevenueDialogOpen(false);
      setRevenueToDeleteId(null);
    }
  };

  // Handlers for Cost actions
  const handleEditCost = (cost: Cost) => {
    setSelectedCost(cost);
    setIsEditCostModalOpen(true);
  };

  const handleViewCost = (cost: Cost) => {
    setSelectedCost(cost);
    setIsViewCostModalOpen(true);
  };

  const handleDeleteCostClick = (costId: string) => {
    setCostToDeleteId(costId);
    setIsDeleteCostDialogOpen(true);
  };

  const handleConfirmDeleteCost = async () => {
    if (!costToDeleteId) return;
    try {
      await deleteCostMutation.mutateAsync(costToDeleteId);
      toast.success("Cost Deleted", { description: "Cost entry permanently deleted." });
      setIsDeleteCostDialogOpen(false);
      setCostToDeleteId(null);
    } catch (err: any) {
      toast.error("Failed to delete cost", { description: err.message || "An unexpected error occurred." });
      setIsDeleteCostDialogOpen(false);
      setCostToDeleteId(null);
    }
  };

  // Render logic based on loading state
  if (isLoading || areUsersLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Costing</CardTitle>
          <CardDescription>Track your total revenue and associated costs.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Loading financial data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue & Costing</CardTitle>
        <CardDescription>Track your total revenue and associated costs.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Financial Summary */}
        <RevenueCostingSummary
          totalAssets={totalAssets}
          totalRevenue={totalRevenue}
          totalCosting={totalCosting}
          netProfit={netProfit}
        />

        {/* Revenue Section */}
        <RevenueSection
          revenues={revenues || []}
          isLoadingRevenues={isLoadingRevenues}
          onAddRevenue={() => setIsAddRevenueModalOpen(true)}
          onEditRevenue={handleEditRevenue}
          onViewRevenue={handleViewRevenue}
          onDeleteRevenue={handleDeleteRevenueClick}
        />

        {/* Cost Section */}
        <CostSection
          costs={costs || []}
          isLoadingCosts={isLoadingCosts}
          onAddCost={() => setIsAddCostModalOpen(true)}
          onEditCost={handleEditCost}
          onViewCost={handleViewCost}
          onDeleteCost={handleDeleteCostClick}
        />
      </CardContent>

      {/* Modals are managed here as they affect the top-level state */}
      <AddRevenueModal
        isOpen={isAddRevenueModalOpen}
        onClose={() => setIsAddRevenueModalOpen(false)}
        users={users || []}
        isLoadingUsers={areUsersLoading}
      />
      <AddCostModal
        isOpen={isAddCostModalOpen}
        onClose={() => setIsAddCostModalOpen(false)}
        users={users || []}
        isLoadingUsers={areUsersLoading}
      />
      <EditRevenueModal
        isOpen={isEditRevenueModalOpen}
        onClose={() => setIsEditRevenueModalOpen(false)}
        revenue={selectedRevenue}
        users={users || []}
        isLoadingUsers={areUsersLoading}
      />
      <ViewRevenueModal
        isOpen={isViewRevenueModalOpen}
        onClose={() => setIsViewRevenueModalOpen(false)}
        revenue={selectedRevenue}
      />
      <EditCostModal
        isOpen={isEditCostModalOpen}
        onClose={() => setIsEditCostModalOpen(false)}
        cost={selectedCost}
        users={users || []}
        isLoadingUsers={areUsersLoading}
      />
      <ViewCostModal
        isOpen={isViewCostModalOpen}
        onClose={() => setIsViewCostModalOpen(false)}
        cost={selectedCost}
      />

      {/* Delete Confirmation Dialogs (reusable component) */}
      <DeleteConfirmationDialog
        isOpen={isDeleteRevenueDialogOpen}
        onConfirm={handleConfirmDeleteRevenue}
        onCancel={() => setIsDeleteRevenueDialogOpen(false)}
        title="Delete Revenue Entry?"
        description="This action cannot be undone. This will permanently delete this revenue entry."
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteCostDialogOpen}
        onConfirm={handleConfirmDeleteCost}
        onCancel={() => setIsDeleteCostDialogOpen(false)}
        title="Delete Cost Entry?"
        description="This action cannot be undone. This will permanently delete this cost entry."
      />
    </Card>
  );
}
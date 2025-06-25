// src/components/financial-management/RevenueCosting.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useFinancialTotals,
  useRevenues,
  useCosts,
  useDeleteRevenue,
  useDeleteCost,
} from "@/hooks/financial-management/useRevenueCost"; // Import delete hooks
import { DataTable } from "@/components/data-table"; // Import DataTable

// Import the new modal components
import { AddRevenueModal } from "./modals/RevenueCosting/AddRevenueModal";
import { AddCostModal } from "./modals/RevenueCosting/AddCostModal";
import { EditRevenueModal } from "./modals/RevenueCosting/EditRevenueModal"; // NEW
import { ViewRevenueModal } from "./modals/RevenueCosting/ViewRevenueModal"; // NEW
import { EditCostModal } from "./modals/RevenueCosting/EditCostModal";     // NEW
import { ViewCostModal } from "./modals/RevenueCosting/ViewCostModal";     // NEW

import { Revenue, Cost } from "@/types"; // Import types

export function RevenueCosting() {
  const { totalAssets, totalRevenue, totalCosting, netProfit, isLoading, error } = useFinancialTotals();
  const { data: revenues, isLoading: isLoadingRevenues, error: revenuesError } = useRevenues();
  const { data: costs, isLoading: isLoadingCosts, error: costsError } = useCosts();

  // State for modals
  const [isAddRevenueModalOpen, setIsAddRevenueModalOpen] = useState(false);
  const [isAddCostModalOpen, setIsAddCostModalOpen] = useState(false);
  const [isEditRevenueModalOpen, setIsEditRevenueModalOpen] = useState(false); // NEW
  const [isViewRevenueModalOpen, setIsViewRevenueModalOpen] = useState(false); // NEW
  const [isEditCostModalOpen, setIsEditCostModalOpen] = useState(false);     // NEW
  const [isViewCostModalOpen, setIsViewCostModalOpen] = useState(false);     // NEW

  const [selectedRevenue, setSelectedRevenue] = useState<Revenue | null>(null); // NEW
  const [selectedCost, setSelectedCost] = useState<Cost | null>(null);       // NEW

  const deleteRevenueMutation = useDeleteRevenue(); // NEW
  const deleteCostMutation = useDeleteCost();     // NEW

  useEffect(() => {
    if (error || revenuesError || costsError) {
      toast.error("Error fetching financial data", {
        description: error?.message || revenuesError?.message || costsError?.message,
      });
    }
  }, [error, revenuesError, costsError]);

  // Handlers for edit/view/delete actions
  const handleEditRevenue = (revenue: Revenue) => { // NEW
    setSelectedRevenue(revenue);
    setIsEditRevenueModalOpen(true);
  };

  const handleViewRevenue = (revenue: Revenue) => { // NEW
    setSelectedRevenue(revenue);
    setIsViewRevenueModalOpen(true);
  };

  const handleDeleteRevenue = async (revenueId: string) => { // NEW
    if (!confirm("Are you sure you want to delete this revenue entry? This action cannot be undone.")) {
      return;
    }
    try {
      await deleteRevenueMutation.mutateAsync(revenueId);
      toast.success("Revenue Deleted", { description: "Revenue entry permanently deleted." });
    } catch (err: any) {
      toast.error("Failed to delete revenue", { description: err.message || "An unexpected error occurred." });
    }
  };

  const handleEditCost = (cost: Cost) => { // NEW
    setSelectedCost(cost);
    setIsEditCostModalOpen(true);
  };

  const handleViewCost = (cost: Cost) => { // NEW
    setSelectedCost(cost);
    setIsViewCostModalOpen(true);
  };

  const handleDeleteCost = async (costId: string) => { // NEW
    if (!confirm("Are you sure you want to delete this cost entry? This action cannot be undone.")) {
      return;
    }
    try {
      await deleteCostMutation.mutateAsync(costId);
      toast.success("Cost Deleted", { description: "Cost entry permanently deleted." });
    } catch (err: any) {
      toast.error("Failed to delete cost", { description: err.message || "An unexpected error occurred." });
    }
  };


  // Define columns for Revenue DataTable
  const revenueColumns = [
    {
      header: "Source",
      cell: (row: Revenue) => row.source,
    },
    {
      header: "Amount",
      cell: (row: Revenue) => `₱${row.amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      header: "Date",
      cell: (row: Revenue) => new Date(row.date).toLocaleDateString(),
    },
    {
      header: "Company",
      cell: (row: Revenue) => row.company?.name || "N/A",
    },
    {
      header: "Asset",
      cell: (row: Revenue) => row.asset?.assetName || "N/A",
    },
    {
      header: "Actions",
      cell: (row: Revenue) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleViewRevenue(row)}>View</Button>
          <Button variant="outline" size="sm" onClick={() => handleEditRevenue(row)}>Edit</Button>
          <Button variant="destructive" size="sm" onClick={() => handleDeleteRevenue(row.id)}>Delete</Button>
        </div>
      ),
    },
  ];

  // Define columns for Cost DataTable
  const costColumns = [
    {
      header: "Category",
      cell: (row: Cost) => row.category,
    },
    {
      header: "Amount",
      cell: (row: Cost) => `-₱${row.amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      header: "Date",
      cell: (row: Cost) => new Date(row.date).toLocaleDateString(),
    },
    {
      header: "Company",
      cell: (row: Cost) => row.company?.name || "N/A",
    },
    {
      header: "Asset",
      cell: (row: Cost) => row.asset?.assetName || "N/A",
    },
    {
      header: "Actions",
      cell: (row: Cost) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleViewCost(row)}>View</Button>
          <Button variant="outline" size="sm" onClick={() => handleEditCost(row)}>Edit</Button>
          <Button variant="destructive" size="sm" onClick={() => handleDeleteCost(row.id)}>Delete</Button>
        </div>
      ),
    },
  ];


  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue & Costing</CardTitle>
        <CardDescription>Track your total revenue and associated costs.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading financial data...</p>
        ) : (
          <>
            <div className="space-y-2 mb-6">
              <h3 className="text-lg font-semibold">
                Total Assets: ₱{totalAssets.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <h3 className="text-lg font-semibold">
                Total Revenue: ₱{totalRevenue.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <h3 className="text-lg font-semibold text-destructive">
                Total Costing: -₱{totalCosting.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <h3 className={`text-lg font-semibold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                Net Profit: ₱{netProfit.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button onClick={() => setIsAddRevenueModalOpen(true)}>Add New Revenue</Button>
              <Button onClick={() => setIsAddCostModalOpen(true)}>Add New Cost</Button>
            </div>

            {/* Revenue Table */}
            <h3 className="text-lg font-semibold mt-6 mb-2">Revenue Entries</h3>
            <DataTable
              columns={revenueColumns}
              data={revenues || []}
              isLoading={isLoadingRevenues}
              noDataMessage="No revenue entries found. Add your first revenue above!"
            />

            {/* Cost Table */}
            <h3 className="text-lg font-semibold mt-8 mb-2">Cost Entries</h3>
            <DataTable
              columns={costColumns}
              data={costs || []}
              isLoading={isLoadingCosts}
              noDataMessage="No cost entries found. Add your first cost above!"
            />
          </>
        )}
      </CardContent>

      {/* Modals */}
      <AddRevenueModal
        isOpen={isAddRevenueModalOpen}
        onClose={() => setIsAddRevenueModalOpen(false)}
      />
      <AddCostModal
        isOpen={isAddCostModalOpen}
        onClose={() => setIsAddCostModalOpen(false)}
      />
      <EditRevenueModal
        isOpen={isEditRevenueModalOpen}
        onClose={() => setIsEditRevenueModalOpen(false)}
        revenue={selectedRevenue}
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
      />
      <ViewCostModal
        isOpen={isViewCostModalOpen}
        onClose={() => setIsViewCostModalOpen(false)}
        cost={selectedCost}
      />
    </Card>
  );
}
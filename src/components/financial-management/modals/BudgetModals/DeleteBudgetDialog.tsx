// src/components/financial-management/modals/BudgetModals/DeleteBudgetDialog.tsx
"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteBudget } from "@/hooks/financial-management/useBudgets";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budgetId: string | null;
  budgetName: string;
};

export function DeleteBudgetDialog({ open, onOpenChange, budgetId, budgetName }: Props) {
  const deleteBudget = useDeleteBudget();

  const handleDelete = async () => {
    if (!budgetId) return;
    try {
      await deleteBudget.mutateAsync(budgetId);
      toast.success("Budget deleted successfully");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete budget");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="glass-card">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Budget</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{budgetName}&quot;? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {deleteBudget.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

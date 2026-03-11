// src/components/financial-management/modals/BudgetModals/EditBudgetModal.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrencyInput } from "@/components/ui/currency-input";
import { useUpdateBudget } from "@/hooks/financial-management/useBudgets";
import type { BudgetWithActuals } from "@/types/budget";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget: BudgetWithActuals | null;
};

export function EditBudgetModal({ open, onOpenChange, budget }: Props) {
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<"REVENUE" | "COST">("COST");
  const [category, setCategory] = React.useState("");
  const [amount, setAmount] = React.useState<number>(0);
  const [period, setPeriod] = React.useState<"MONTHLY" | "QUARTERLY" | "YEARLY">("MONTHLY");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  const updateBudget = useUpdateBudget();

  React.useEffect(() => {
    if (budget) {
      setName(budget.name);
      setType(budget.type);
      setCategory(budget.category);
      setAmount(budget.amount);
      setPeriod(budget.period);
      setStartDate(budget.startDate.split("T")[0]);
      setEndDate(budget.endDate.split("T")[0]);
    }
  }, [budget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget) return;

    try {
      await updateBudget.mutateAsync({
        id: budget.id,
        payload: {
          name,
          type,
          category,
          amount,
          period,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
        },
      });
      toast.success("Budget updated successfully");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update budget");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] glass-card">
        <DialogHeader>
          <DialogTitle className="text-gradient-primary">Edit Budget</DialogTitle>
          <DialogDescription>
            Update your budget settings and limits.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="editBudgetName">Budget Name</Label>
            <Input
              id="editBudgetName"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="editBudgetType">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as "REVENUE" | "COST")}>
              <SelectTrigger id="editBudgetType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COST">Cost / Spending Limit</SelectItem>
                <SelectItem value="REVENUE">Revenue / Income Target</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="editBudgetCategory">
              {type === "COST" ? "Cost Category" : "Revenue Source"}
            </Label>
            <Input
              id="editBudgetCategory"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="editBudgetAmount">
              {type === "COST" ? "Spending Limit" : "Revenue Target"}
            </Label>
            <CurrencyInput
              id="editBudgetAmount"
              value={amount || ""}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="editBudgetPeriod">Period</Label>
            <Select value={period} onValueChange={(v) => setPeriod(v as "MONTHLY" | "QUARTERLY" | "YEARLY")}>
              <SelectTrigger id="editBudgetPeriod">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="editBudgetStartDate">Start Date</Label>
              <Input
                id="editBudgetStartDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editBudgetEndDate">End Date</Label>
              <Input
                id="editBudgetEndDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" disabled={updateBudget.isPending}>
              {updateBudget.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

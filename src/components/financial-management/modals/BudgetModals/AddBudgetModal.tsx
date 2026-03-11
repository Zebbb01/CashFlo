// src/components/financial-management/modals/BudgetModals/AddBudgetModal.tsx
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
import { useCreateBudget } from "@/hooks/financial-management/useBudgets";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddBudgetModal({ open, onOpenChange }: Props) {
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<"REVENUE" | "COST">("COST");
  const [category, setCategory] = React.useState("");
  const [amount, setAmount] = React.useState<number>(0);
  const [period, setPeriod] = React.useState<"MONTHLY" | "QUARTERLY" | "YEARLY">("MONTHLY");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  const createBudget = useCreateBudget();

  const resetForm = () => {
    setName("");
    setType("COST");
    setCategory("");
    setAmount(0);
    setPeriod("MONTHLY");
    setStartDate("");
    setEndDate("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !category || !amount || !startDate || !endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createBudget.mutateAsync({
        name,
        type,
        category,
        amount,
        period,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      });
      toast.success("Budget created successfully");
      resetForm();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create budget");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] glass-card">
        <DialogHeader>
          <DialogTitle className="text-gradient-primary">Create New Budget</DialogTitle>
          <DialogDescription>
            Set a spending limit or revenue target for a specific category.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budgetName">Budget Name</Label>
            <Input
              id="budgetName"
              placeholder="e.g., Marketing Q1 Budget"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetType">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as "REVENUE" | "COST")}>
              <SelectTrigger id="budgetType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COST">Cost / Spending Limit</SelectItem>
                <SelectItem value="REVENUE">Revenue / Income Target</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetCategory">
              {type === "COST" ? "Cost Category" : "Revenue Source"}
            </Label>
            <Input
              id="budgetCategory"
              placeholder={type === "COST" ? "e.g., Marketing, Rent" : "e.g., Consulting, Sales"}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Must match existing {type === "COST" ? "cost categories" : "revenue sources"} exactly for tracking
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetAmount">
              {type === "COST" ? "Spending Limit" : "Revenue Target"}
            </Label>
            <CurrencyInput
              id="budgetAmount"
              value={amount || ""}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetPeriod">Period</Label>
            <Select value={period} onValueChange={(v) => setPeriod(v as "MONTHLY" | "QUARTERLY" | "YEARLY")}>
              <SelectTrigger id="budgetPeriod">
                <SelectValue placeholder="Select period" />
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
              <Label htmlFor="budgetStartDate">Start Date</Label>
              <Input
                id="budgetStartDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetEndDate">End Date</Label>
              <Input
                id="budgetEndDate"
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
            <Button type="submit" variant="gradient" disabled={createBudget.isPending}>
              {createBudget.isPending ? "Creating..." : "Create Budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

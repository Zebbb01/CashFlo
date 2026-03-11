// src/types/budget.ts

export type BudgetType = 'REVENUE' | 'COST';
export type BudgetPeriod = 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export type Budget = {
  id: string;
  name: string;
  type: BudgetType;
  category: string;
  amount: number;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type BudgetWithActuals = Budget & {
  actualAmount: number;
  percentageUsed: number;
  status: 'under' | 'near' | 'over';
  remaining: number;
};

export type CreateBudgetPayload = {
  name: string;
  type: BudgetType;
  category: string;
  amount: number;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
};

export type UpdateBudgetPayload = Partial<CreateBudgetPayload>;

// src/lib/services/budget.service.ts
import { prisma } from '@/lib/prisma';
import type { BudgetWithActuals } from '@/types/budget';
import { BudgetType, BudgetPeriod } from '@prisma/client';

export class BudgetService {
  static async findAll(userId: string): Promise<BudgetWithActuals[]> {
    const budgets = await prisma.budget.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // For each budget, compute actual amounts
    const results: BudgetWithActuals[] = await Promise.all(
      budgets.map(async (budget) => {
        const actualAmount = await this.getActualAmount(
          userId,
          budget.type,
          budget.category,
          budget.startDate,
          budget.endDate
        );

        const percentageUsed = budget.amount > 0 ? (actualAmount / budget.amount) * 100 : 0;
        const status = percentageUsed >= 90 ? 'over' : percentageUsed >= 70 ? 'near' : 'under';
        const remaining = budget.amount - actualAmount;

        return {
          id: budget.id,
          name: budget.name,
          type: budget.type as 'REVENUE' | 'COST',
          category: budget.category,
          amount: budget.amount,
          period: budget.period as 'MONTHLY' | 'QUARTERLY' | 'YEARLY',
          startDate: budget.startDate.toISOString(),
          endDate: budget.endDate.toISOString(),
          userId: budget.userId,
          createdAt: budget.createdAt.toISOString(),
          updatedAt: budget.updatedAt.toISOString(),
          actualAmount,
          percentageUsed: Math.round(percentageUsed * 100) / 100,
          status,
          remaining,
        };
      })
    );

    return results;
  }

  static async findById(id: string, userId: string): Promise<BudgetWithActuals | null> {
    const budget = await prisma.budget.findFirst({
      where: { id, userId },
    });

    if (!budget) return null;

    const actualAmount = await this.getActualAmount(
      userId,
      budget.type,
      budget.category,
      budget.startDate,
      budget.endDate
    );

    const percentageUsed = budget.amount > 0 ? (actualAmount / budget.amount) * 100 : 0;
    const status = percentageUsed >= 90 ? 'over' : percentageUsed >= 70 ? 'near' : 'under';
    const remaining = budget.amount - actualAmount;

    return {
      id: budget.id,
      name: budget.name,
      type: budget.type as 'REVENUE' | 'COST',
      category: budget.category,
      amount: budget.amount,
      period: budget.period as 'MONTHLY' | 'QUARTERLY' | 'YEARLY',
      startDate: budget.startDate.toISOString(),
      endDate: budget.endDate.toISOString(),
      userId: budget.userId,
      createdAt: budget.createdAt.toISOString(),
      updatedAt: budget.updatedAt.toISOString(),
      actualAmount,
      percentageUsed: Math.round(percentageUsed * 100) / 100,
      status,
      remaining,
    };
  }

  static async create(data: {
    name: string;
    type: BudgetType;
    category: string;
    amount: number;
    period: BudgetPeriod;
    startDate: string;
    endDate: string;
    userId: string;
  }) {
    return prisma.budget.create({
      data: {
        name: data.name,
        type: data.type,
        category: data.category,
        amount: data.amount,
        period: data.period,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        user: { connect: { id: data.userId } },
      },
    });
  }

  static async update(
    id: string,
    userId: string,
    data: Partial<{
      name: string;
      type: BudgetType;
      category: string;
      amount: number;
      period: BudgetPeriod;
      startDate: string;
      endDate: string;
    }>
  ) {
    // Ensure user owns the budget
    const existing = await prisma.budget.findFirst({ where: { id, userId } });
    if (!existing) throw new Error('Budget not found');

    const updateData: any = { ...data };
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);

    return prisma.budget.update({
      where: { id },
      data: updateData,
    });
  }

  static async delete(id: string, userId: string) {
    const existing = await prisma.budget.findFirst({ where: { id, userId } });
    if (!existing) throw new Error('Budget not found');

    return prisma.budget.delete({ where: { id } });
  }

  /**
   * Calculate actual amount spent/earned for a given category within the date range.
   */
  private static async getActualAmount(
    userId: string,
    type: BudgetType,
    category: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    if (type === 'COST') {
      const result = await prisma.cost.aggregate({
        _sum: { amount: true },
        where: {
          category: { equals: category, mode: 'insensitive' },
          date: { gte: startDate, lte: endDate },
          OR: [
            { userId },
            { costAttributions: { some: { userId } } },
          ],
        },
      });
      return result._sum.amount || 0;
    } else {
      const result = await prisma.revenue.aggregate({
        _sum: { amount: true },
        where: {
          source: { equals: category, mode: 'insensitive' },
          date: { gte: startDate, lte: endDate },
          OR: [
            { userId },
            { revenueShares: { some: { userId } } },
          ],
        },
      });
      return result._sum.amount || 0;
    }
  }
}

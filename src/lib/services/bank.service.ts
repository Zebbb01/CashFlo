// src/lib/services/bank.service.ts
import { prisma } from '@/lib/prisma';
import { Bank, AssetManagement, Revenue, Cost } from '@prisma/client'; // Corrected imports

// Define a type for Bank with included relations and overallSavings
type BankWithSavings = Bank & {
  overallSavings?: number; // Make it optional since it's calculated
  assets?: (AssetManagement & {
    revenuesForBank: Revenue[]; // Use Revenue type
    costsForBank: Cost[];     // Use Cost type
  })[];
};

export class BankService {
  static async findById(id: string): Promise<BankWithSavings | null> {
    const bank = await prisma.bank.findUnique({
      where: { id },
      include: {
        assets: {
          include: {
            revenuesForBank: true,
            costsForBank: true,
          },
        },
      },
    });

    if (!bank) {
      return null;
    }

    return this.calculateOverallSavings(bank);
  }

  static async findAll(): Promise<BankWithSavings[]> {
    const banks = await prisma.bank.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        assets: {
          include: {
            revenuesForBank: true,
            costsForBank: true,
          },
        },
      },
    });

    return banks.map(bank => this.calculateOverallSavings(bank));
  }

  static async create(data: { name: string }): Promise<Bank> {
    return prisma.bank.create({
      data: {
        name: data.name,
      },
    });
  }

  static async update(id: string, data: Partial<{ name: string }>): Promise<Bank> {
    return prisma.bank.update({
      where: { id },
      data: {
        name: data.name,
      },
    });
  }

  static async delete(id: string): Promise<void> {
    await prisma.bank.delete({
      where: { id },
    });
  }

  private static calculateOverallSavings(bank: BankWithSavings): BankWithSavings {
    let totalRevenue = 0;
    let totalCost = 0;

    // The 'assets' property might be undefined if not explicitly included in the query
    // Adding a nullish coalescing operator (?? []) or an optional chaining (?) check
    // ensures the loop doesn't throw an error if assets are not loaded.
    bank.assets?.forEach(asset => {
      asset.revenuesForBank.forEach(revenue => totalRevenue += revenue.amount);
      asset.costsForBank.forEach(cost => totalCost += cost.amount);
    });

    const overallSavings = totalRevenue - totalCost;
    return { ...bank, overallSavings };
  }
}
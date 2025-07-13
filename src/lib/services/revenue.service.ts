// src/lib/services/revenue.service.ts
import { prisma } from '@/lib/prisma';
import { Revenue, AssetManagement, User, RevenueShare, AssetPartnership, Bank, Company } from '@prisma/client';

// Extend Revenue type to include relations with correct nullability for nested objects
type RevenueWithDetails = Revenue & {
  bankAssetManagement?: (AssetManagement & {
    bank: Bank | null; // Explicitly allow Bank to be null
    company: Company; // Company is non-nullable in AssetManagement relationship
  }) | null; // bankAssetManagement itself can be null
  user?: User | null; // User can be null (user who recorded it)
  revenueShares?: (RevenueShare & { user: { id: string; name: string | null; email: string; } })[];
};

export class RevenueService {
  static async findById(id: string): Promise<RevenueWithDetails | null> {
    return prisma.revenue.findUnique({
      where: { id },
      include: {
        bankAssetManagement: {
          include: {
            bank: true,
            company: true,
          },
        },
        user: true,
        revenueShares: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      },
    }) as Promise<RevenueWithDetails | null>; // Assert the return type
  }

  static async findAll(): Promise<RevenueWithDetails[]> {
    return prisma.revenue.findMany({
      include: {
        bankAssetManagement: {
          include: {
            bank: true,
            company: true,
          },
        },
        user: true,
        revenueShares: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      },
      orderBy: {
        date: 'desc',
      },
    }) as Promise<RevenueWithDetails[]>; // Assert the return type
  }

  static async create(data: {
    source: string;
    amount: number;
    date?: string;
    description?: string;
    bankAssetManagementId: string;
    recordedByUserId: string; // User who recorded the revenue
  }): Promise<RevenueWithDetails> { // Changed return type to RevenueWithDetails
    const { source, amount, date, description, bankAssetManagementId, recordedByUserId } = data;

    // Validate the user who recorded the revenue
    const userExists = await prisma.user.findUnique({ where: { id: recordedByUserId } });
    if (!userExists) {
      throw new Error('User recording revenue not found.');
    }

    const newRevenue = await prisma.$transaction(async (prisma) => {
      const createdRevenue = await prisma.revenue.create({
        data: {
          source,
          amount,
          date: date ? new Date(date) : undefined,
          description,
          bankAssetManagement: { connect: { id: bankAssetManagementId } },
          user: { connect: { id: recordedByUserId } },
        },
      });

      // Find all active partnerships for the associated asset
      const activePartnerships = await prisma.assetPartnership.findMany({
        where: {
          assetId: bankAssetManagementId,
          isActive: true,
        },
      });

      const revenueSharesData: Array<{ revenueId: string; assetId: string; userId: string; shareAmount: number; percentage: number }> = [];

      let totalPartnerPercentage = activePartnerships.reduce((sum, p) => sum + p.sharePercentage, 0);

      if (totalPartnerPercentage > 100.0001) { // Allow for minor floating point inaccuracies
        throw new Error('Total active partnership percentage exceeds 100% for this asset. Please correct partnerships before adding revenue.');
      }

      if (activePartnerships.length === 0) {
        // No active partners defined, so 100% goes to the user who recorded it
        revenueSharesData.push({
          revenueId: createdRevenue.id,
          assetId: bankAssetManagementId,
          userId: recordedByUserId,
          shareAmount: createdRevenue.amount,
          percentage: 100,
        });
      } else {
        // Distribute among active partners
        activePartnerships.forEach(p => {
          revenueSharesData.push({
            revenueId: createdRevenue.id,
            assetId: bankAssetManagementId,
            userId: p.userId,
            shareAmount: createdRevenue.amount * (p.sharePercentage / 100),
            percentage: p.sharePercentage,
          });
        });

        // Handle unallocated remainder if totalPartnerPercentage < 100
        if (totalPartnerPercentage < 99.9999) { // Using threshold for float comparison
          const unallocatedPercentage = 100 - totalPartnerPercentage;
          const unallocatedAmount = createdRevenue.amount * (unallocatedPercentage / 100);

          const recorderShareIndex = revenueSharesData.findIndex(rs => rs.userId === recordedByUserId);
          if (recorderShareIndex !== -1) {
            revenueSharesData[recorderShareIndex].shareAmount += unallocatedAmount;
            revenueSharesData[recorderShareIndex].percentage += unallocatedPercentage;
          } else {
            revenueSharesData.push({
              revenueId: createdRevenue.id,
              assetId: bankAssetManagementId,
              userId: recordedByUserId,
              shareAmount: unallocatedAmount,
              percentage: unallocatedPercentage,
            });
          }
        }
      }

      if (revenueSharesData.length > 0) {
        await prisma.revenueShare.createMany({
          data: revenueSharesData,
        });
      }

      return createdRevenue;
    });

    // Fetch the newly created revenue with its shares for the response
    const revenueWithShares = await prisma.revenue.findUnique({
      where: { id: newRevenue.id },
      include: {
        bankAssetManagement: {
          include: {
            bank: true,
            company: true,
          },
        },
        user: true,
        revenueShares: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    // We can safely assert here as the findUnique should return it
    return revenueWithShares as RevenueWithDetails;
  }

  static async update(id: string, data: Partial<{
    source: string;
    amount: number;
    date: string;
    description: string;
    bankAssetManagementId: string;
    userId: string; // The user who recorded the revenue
  }>): Promise<Revenue> {
    const { bankAssetManagementId, userId, date, ...rest } = data;

    // Validate bankAssetManagementId if provided
    if (bankAssetManagementId !== undefined && bankAssetManagementId !== null) {
      const assetExists = await prisma.assetManagement.findUnique({ where: { id: bankAssetManagementId } });
      if (!assetExists) {
        throw new Error('Bank Asset Management not found');
      }
    }

    // Validate userId if provided
    if (userId !== undefined && userId !== null) {
      const userExists = await prisma.user.findUnique({ where: { id: userId } });
      if (!userExists) {
        throw new Error('User not found');
      }
    }

    return prisma.revenue.update({
      where: { id },
      data: {
        ...rest,
        date: date ? new Date(date) : undefined,
        bankAssetManagement: bankAssetManagementId !== undefined ? (bankAssetManagementId ? { connect: { id: bankAssetManagementId } } : { disconnect: true }) : undefined,
        user: userId !== undefined ? (userId ? { connect: { id: userId } } : { disconnect: true }) : undefined,
      },
    });
  }

  static async delete(id: string): Promise<void> {
    await prisma.revenue.delete({
      where: { id },
    });
  }
}
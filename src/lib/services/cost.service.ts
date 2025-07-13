// src/lib/services/cost.service.ts
import { prisma } from '@/lib/prisma';
import { Cost, AssetManagement, User, CostAttribution, AssetPartnership, Bank, Company } from '@prisma/client';

// Extend Cost type to include relations with correct nullability for nested objects
type CostWithDetails = Cost & {
  bankAssetManagement?: (AssetManagement & {
    bank: Bank | null; // <-- Changed: Explicitly allow Bank to be null
    company: Company; // Company is non-nullable in AssetManagement relationship
  }) | null; // <-- Changed: bankAssetManagement itself can be null
  user?: User | null; // <-- Changed: User can be null
  costAttributions?: (CostAttribution & { user: { id: string; name: string | null; email: string; } })[];
};

export class CostService {
  static async findById(id: string): Promise<CostWithDetails | null> {
    // The `include` structure here matches the `CostWithDetails` type
    return prisma.cost.findUnique({
      where: { id },
      include: {
        bankAssetManagement: {
          include: {
            bank: true,
            company: true,
          },
        },
        user: true,
        costAttributions: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      },
    }) as Promise<CostWithDetails | null>; // Assert the return type
  }

  static async findAll(): Promise<CostWithDetails[]> {
    return prisma.cost.findMany({
      include: {
        bankAssetManagement: {
          include: {
            bank: true,
            company: true,
          },
        },
        user: true,
        costAttributions: {
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
    }) as Promise<CostWithDetails[]>; // Assert the return type
  }

  static async create(data: {
    category: string;
    amount: number;
    date?: string;
    description?: string;
    bankAssetManagementId: string;
    incurredByUserId: string; // User who incurred the cost
    attributedToUserIds?: string[]; // Optional specific attribution
  }): Promise<CostWithDetails> { // Changed return type to CostWithDetails
    const { category, amount, date, description, bankAssetManagementId, incurredByUserId, attributedToUserIds } = data;

    // Validate the user who incurred the cost
    const userExists = await prisma.user.findUnique({ where: { id: incurredByUserId } });
    if (!userExists) {
      throw new Error('User incurring cost not found.');
    }

    let specificAttribution = false;
    let validAttributedUsers: string[] = [];

    if (attributedToUserIds && Array.isArray(attributedToUserIds) && attributedToUserIds.length > 0) {
      specificAttribution = true;
      const activePartners = await prisma.assetPartnership.findMany({
        where: {
          assetId: bankAssetManagementId,
          isActive: true,
          userId: { in: attributedToUserIds }
        },
        select: { userId: true }
      });
      validAttributedUsers = activePartners.map(p => p.userId);
      if (validAttributedUsers.length !== attributedToUserIds.length) {
        throw new Error('One or more specified attributed users are not active partners for this asset.');
      }
    }

    const newCost = await prisma.$transaction(async (prisma) => {
      const createdCost = await prisma.cost.create({
        data: {
          category,
          amount,
          date: date ? new Date(date) : undefined,
          description,
          bankAssetManagement: { connect: { id: bankAssetManagementId } },
          user: { connect: { id: incurredByUserId } },
        },
      });

      const costAttributionsData: Array<{ costId: string; assetId: string; userId: string; attributedAmount: number; percentage: number }> = [];

      if (specificAttribution) {
        const numAttributedUsers = validAttributedUsers.length;
        if (numAttributedUsers === 0) {
          throw new Error('No valid users specified for cost attribution.');
        }
        const perUserAmount = createdCost.amount / numAttributedUsers;
        const perUserPercentage = 100 / numAttributedUsers;

        validAttributedUsers.forEach(userId => {
          costAttributionsData.push({
            costId: createdCost.id,
            assetId: bankAssetManagementId,
            userId: userId,
            attributedAmount: perUserAmount,
            percentage: perUserPercentage,
          });
        });
      } else {
        const activePartnerships = await prisma.assetPartnership.findMany({
          where: {
            assetId: bankAssetManagementId,
            isActive: true,
          },
        });

        let totalPartnerPercentage = activePartnerships.reduce((sum, p) => sum + p.sharePercentage, 0);

        if (totalPartnerPercentage > 100.0001) {
          throw new Error('Total active partnership percentage exceeds 100% for this asset. Please correct partnerships before adding cost.');
        }

        if (activePartnerships.length === 0) {
          costAttributionsData.push({
            costId: createdCost.id,
            assetId: bankAssetManagementId,
            userId: incurredByUserId,
            attributedAmount: createdCost.amount,
            percentage: 100,
          });
        } else {
          activePartnerships.forEach(p => {
            costAttributionsData.push({
              costId: createdCost.id,
              assetId: bankAssetManagementId,
              userId: p.userId,
              attributedAmount: createdCost.amount * (p.sharePercentage / 100),
              percentage: p.sharePercentage,
            });
          });

          if (totalPartnerPercentage < 99.9999) {
            const unallocatedPercentage = 100 - totalPartnerPercentage;
            const unallocatedAmount = createdCost.amount * (unallocatedPercentage / 100);

            const incurrerAttributionIndex = costAttributionsData.findIndex(ca => ca.userId === incurredByUserId);
            if (incurrerAttributionIndex !== -1) {
              costAttributionsData[incurrerAttributionIndex].attributedAmount += unallocatedAmount;
              costAttributionsData[incurrerAttributionIndex].percentage += unallocatedPercentage;
            } else {
              costAttributionsData.push({
                costId: createdCost.id,
                assetId: bankAssetManagementId,
                userId: incurredByUserId,
                attributedAmount: unallocatedAmount,
                percentage: unallocatedPercentage,
              });
            }
          }
        }
      }

      if (costAttributionsData.length > 0) {
        await prisma.costAttribution.createMany({
          data: costAttributionsData,
        });
      }

      return createdCost;
    });

    // Fetch the newly created cost with its attributions for the response
    const costWithAttributions = await prisma.cost.findUnique({
      where: { id: newCost.id },
      include: {
        bankAssetManagement: {
          include: {
            bank: true,
            company: true,
          },
        },
        user: true,
        costAttributions: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    // We can safely assert here as the findUnique should return it
    return costWithAttributions as CostWithDetails;
  }

  static async update(id: string, data: Partial<{
    category: string;
    amount: number;
    date: string;
    description: string;
    bankAssetManagementId: string;
    userId: string; // The user who incurred the cost, not for attribution
  }>): Promise<Cost> {
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

    return prisma.cost.update({
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
    await prisma.cost.delete({
      where: { id },
    });
  }
}
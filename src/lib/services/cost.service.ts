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

  static async findAll(userId: string): Promise<CostWithDetails[]> {
    return prisma.cost.findMany({
      where: {
        OR: [
          { userId: userId }, // Costs incurred by the user
          { costAttributions: { some: { userId: userId } } }, // Costs where user has an attribution
        ],
      },
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

    // --- START OF MODIFIED LOGIC ---
    // Fetch the asset to get its owner's ID
    const asset = await prisma.assetManagement.findUnique({
      where: { id: bankAssetManagementId },
      select: {
        userId: true, // Assuming `userId` is the owner's ID field on AssetManagement
      },
    });

    if (!asset) {
      throw new Error('Bank Asset Management not found for attribution validation.');
    }

    let specificAttribution = false;
    let finalAttributedUserIds: string[] = []; // Renamed from validAttributedUsers for clarity

    if (attributedToUserIds && Array.isArray(attributedToUserIds) && attributedToUserIds.length > 0) {
      specificAttribution = true;

      // Fetch active partners for the asset
      const activePartnerships = await prisma.assetPartnership.findMany({
        where: {
          assetId: bankAssetManagementId,
          isActive: true,
        },
        select: { userId: true }
      });
      const partnerUserIds = activePartnerships.map(p => p.userId);

      // Create a set of all valid users for attribution (owner + partners)
      const allValidAttributionIds = new Set<string>();
      if (asset.userId) { // Add asset owner to valid IDs
        allValidAttributionIds.add(asset.userId);
      }
      partnerUserIds.forEach(id => allValidAttributionIds.add(id));

      // Check if ALL selected attributedToUserIds are in the set of valid attribution IDs
      const allSelectedUsersAreValid = attributedToUserIds.every(id => allValidAttributionIds.has(id));

      if (!allSelectedUsersAreValid) {
        throw new Error('One or more specified attributed users are not valid (not an active partner or the asset owner) for this asset.');
      }
      finalAttributedUserIds = attributedToUserIds; // If valid, use them
    }
    // --- END OF MODIFIED LOGIC ---

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
        const numAttributedUsers = finalAttributedUserIds.length;
        if (numAttributedUsers === 0) {
          // This case should ideally be caught by the frontend validation and the previous backend validation,
          // but as a safeguard, re-throw if somehow empty.
          throw new Error('No valid users specified for cost attribution after manual selection.');
        }
        const perUserAmount = createdCost.amount / numAttributedUsers;
        const perUserPercentage = 100 / numAttributedUsers;

        finalAttributedUserIds.forEach(userId => {
          costAttributionsData.push({
            costId: createdCost.id,
            assetId: bankAssetManagementId,
            userId: userId,
            attributedAmount: perUserAmount,
            percentage: perUserPercentage,
          });
        });
      } else {
        // If not specific attribution, automatically attribute based on existing partnership percentages
        const activePartnerships = await prisma.assetPartnership.findMany({
          where: {
            assetId: bankAssetManagementId,
            isActive: true,
          },
        });

        let totalPartnerPercentage = activePartnerships.reduce((sum, p) => sum + p.sharePercentage, 0);

        if (totalPartnerPercentage > 100.0001) { // Allowing for floating point inaccuracies
          throw new Error('Total active partnership percentage exceeds 100% for this asset. Please correct partnerships before adding cost.');
        }

        // If no active partnerships, attribute 100% to the incurredByUserId
        if (activePartnerships.length === 0) {
          costAttributionsData.push({
            costId: createdCost.id,
            assetId: bankAssetManagementId,
            userId: incurredByUserId, // Fallback to incurred user if no partners
            attributedAmount: createdCost.amount,
            percentage: 100,
          });
        } else {
          // Attribute based on partnership percentages
          activePartnerships.forEach(p => {
            costAttributionsData.push({
              costId: createdCost.id,
              assetId: bankAssetManagementId,
              userId: p.userId,
              attributedAmount: createdCost.amount * (p.sharePercentage / 100),
              percentage: p.sharePercentage,
            });
          });

          // If there's an unallocated percentage (less than 100% total among partners),
          // attribute the remainder to the user who incurred the cost.
          if (totalPartnerPercentage < 99.9999) { // Allowing for floating point inaccuracies
            const unallocatedPercentage = 100 - totalPartnerPercentage;
            const unallocatedAmount = createdCost.amount * (unallocatedPercentage / 100);

            // Find if the incurrer is already in attributions (e.g., as a partner)
            const incurrerAttributionIndex = costAttributionsData.findIndex(ca => ca.userId === incurredByUserId);
            if (incurrerAttributionIndex !== -1) {
              // If already there, add to their existing attribution
              costAttributionsData[incurrerAttributionIndex].attributedAmount += unallocatedAmount;
              costAttributionsData[incurrerAttributionIndex].percentage += unallocatedPercentage;
            } else {
              // Otherwise, create a new attribution for the incurrer
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
// src/lib/services/partnership.service.ts
import { prisma } from '@/lib/prisma';

export class PartnershipService {
  static async getAssetPartnerships(assetId: string) {
    const asset = await prisma.assetManagement.findUnique({
      where: { id: assetId },
      select: {
        id: true,
        assetName: true,
        assetType: true,
        userId: true,
        company: { select: { id: true, name: true, description: true } },
        bank: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true, email: true } }
      }
    });

    if (!asset) return null;

    const partnerships = await prisma.assetPartnership.findMany({
      where: { assetId, isActive: true },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } }
      },
      orderBy: { sharePercentage: 'desc' }
    });

    const totalAllocated = partnerships.reduce((sum, p) => sum + p.sharePercentage, 0);

    return {
      asset: {
        id: asset.id,
        name: asset.assetName,
        type: asset.assetType,
        company: asset.company,
        bank: asset.bank,
        ownerId: asset.userId,
      },
      partnerships,
      totalAllocated,
      availablePercentage: 100 - totalAllocated
    };
  }

  static async getPartnershipDetails(assetId: string, userId: string) {
    const partnership = await prisma.assetPartnership.findUnique({
      where: { assetId_userId: { assetId, userId } },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        asset: { select: { id: true, assetName: true, assetType: true } }
      }
    });

    if (!partnership) return null;

    const [revenueShares, costAttributions] = await Promise.all([
      prisma.revenueShare.findMany({
        where: { assetId, userId },
        include: {
          revenue: { select: { id: true, source: true, amount: true, date: true, description: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.costAttribution.findMany({
        where: { assetId, userId },
        include: {
          cost: { select: { id: true, category: true, amount: true, date: true, description: true } }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    const totalRevenueShare = revenueShares.reduce((sum, rs) => sum + rs.shareAmount, 0);
    const totalCostAttribution = costAttributions.reduce((sum, ca) => sum + ca.attributedAmount, 0);

    return {
      partnership,
      revenueShares,
      costAttributions,
      totals: {
        totalRevenueShare,
        totalCostAttribution,
        netAmount: totalRevenueShare - totalCostAttribution
      }
    };
  }

  static async updatePartnership(
    assetId: string,
    userId: string,
    updates: { sharePercentage?: number; isActive?: boolean }
  ) {
    const partnership = await prisma.assetPartnership.findUnique({
      where: { assetId_userId: { assetId, userId } }
    });

    if (!partnership) return null;

    // Validate percentage limits
    if (updates.sharePercentage !== undefined && updates.isActive !== false) {
      const totalOtherShares = await prisma.assetPartnership.aggregate({
        where: {
          assetId,
          userId: { not: userId },
          isActive: true
        },
        _sum: { sharePercentage: true }
      });

      const totalAfterUpdate = (totalOtherShares._sum.sharePercentage || 0) + updates.sharePercentage;
      if (totalAfterUpdate > 100.0001) {
        throw new Error(`Total share would exceed 100%. Current: ${totalAfterUpdate.toFixed(2)}%`);
      }
    }

    const updateData: any = {};
    if (updates.sharePercentage !== undefined) {
      updateData.sharePercentage = updates.sharePercentage;
    }
    if (updates.isActive !== undefined) {
      updateData.isActive = updates.isActive;
      updateData.leftAt = updates.isActive ? null : new Date();
    }

    return prisma.assetPartnership.update({
      where: { assetId_userId: { assetId, userId } },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        asset: { select: { id: true, assetName: true } }
      }
    });
  }

  static async createInvitation(data: {
    assetId: string;
    senderId: string;
    receiverId: string;
    sharePercentage: number;
    message?: string;
  }) {
    // Validation logic...
    const [asset, receiver, existingPartnership, existingInvitation] = await Promise.all([
      prisma.assetManagement.findUnique({ where: { id: data.assetId } }),
      prisma.user.findUnique({ where: { id: data.receiverId } }),
      prisma.assetPartnership.findUnique({
        where: { assetId_userId: { assetId: data.assetId, userId: data.receiverId } }
      }),
      prisma.partnershipInvitation.findFirst({
        where: { assetId: data.assetId, receiverId: data.receiverId, status: 'PENDING' }
      })
    ]);

    if (!asset) throw new Error('Asset not found');
    if (!receiver) throw new Error('Receiver not found');
    if (data.senderId === data.receiverId) throw new Error('Cannot invite yourself');
    if (existingPartnership?.isActive || existingInvitation) {
      throw new Error('User already has active partnership or pending invitation');
    }

    return prisma.partnershipInvitation.create({
      data: {
        ...data,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      include: {
        asset: { select: { id: true, assetName: true, assetType: true } },
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } }
      }
    });
  }
}
// src/lib/services/invitation.service.ts
import { prisma } from '@/lib/prisma';
import { PartnershipInvitation, AssetManagement, User } from '@prisma/client';

// Define a type for invitations with included relations for consistency
type PartnershipInvitationWithDetails = PartnershipInvitation & {
  sender?: User | null;
  receiver?: User | null;
  asset?: AssetManagement | null; // asset can be null if it's been deleted
};

export class InvitationService {
  /**
   * Handles accepting or rejecting a partnership invitation.
   * @param invitationId The ID of the invitation.
   * @param currentUserId The ID of the authenticated user attempting to act on the invitation.
   * @param action 'accept' or 'reject'.
   * @returns The updated invitation and a message.
   */
  static async handleInvitationResponse(
    invitationId: string,
    currentUserId: string,
    action: 'accept' | 'reject'
  ): Promise<{ message: string; invitation: PartnershipInvitation }> {
    const invitation = await prisma.partnershipInvitation.findUnique({
      where: { id: invitationId },
      include: { asset: true }
    });

    if (!invitation || invitation.receiverId !== currentUserId) {
      throw new Error('Invitation not found or not for this user.');
    }

    if (invitation.status !== 'PENDING') {
      throw new Error(`Invitation has already been ${invitation.status.toLowerCase()}.`);
    }

    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      // If expired, update status and throw error
      await prisma.partnershipInvitation.update({
        where: { id: invitationId },
        data: { status: 'EXPIRED', message: 'Invitation expired.' }
      });
      throw new Error('Invitation has expired.');
    }

    let updatedInvitation: PartnershipInvitation;

    if (action === 'accept') {
      if (!invitation.asset) {
        throw new Error('Cannot accept invitation: Associated asset not found.');
      }

      const currentActivePartnerships = await prisma.assetPartnership.aggregate({
        where: {
          assetId: invitation.assetId,
          isActive: true
        },
        _sum: {
          sharePercentage: true
        }
      });

      const totalAfterAccept = (currentActivePartnerships._sum.sharePercentage || 0) + invitation.sharePercentage;

      if (totalAfterAccept > 100.0001) { // Using a small epsilon for floating point comparison robustness
        await prisma.partnershipInvitation.update({
          where: { id: invitationId },
          data: { status: 'REJECTED', message: 'Rejected: Accepting would exceed 100% total share for the asset.' }
        });
        throw new Error(`Cannot accept invitation: Total active share for asset "${invitation.asset.assetName}" would be ${totalAfterAccept.toFixed(2)}%, exceeding 100%. Invitation rejected.`);
      }

      await prisma.$transaction(async (prisma) => {
        updatedInvitation = await prisma.partnershipInvitation.update({
          where: { id: invitationId },
          data: { status: 'ACCEPTED' }
        });

        await prisma.assetPartnership.create({
          data: {
            assetId: invitation.assetId,
            userId: invitation.receiverId,
            sharePercentage: invitation.sharePercentage,
            isActive: true,
          }
        });
      });

      return {
        message: 'Partnership invitation accepted successfully. You are now a partner in this asset.',
        invitation: updatedInvitation!, // Assertion as it's assigned in transaction
      };

    } else { // action === 'reject'
      updatedInvitation = await prisma.partnershipInvitation.update({
        where: { id: invitationId },
        data: { status: 'REJECTED' }
      });
      return {
        message: 'Partnership invitation rejected.',
        invitation: updatedInvitation,
      };
    }
  }

  /**
   * Fetches partnership invitations for a specific user.
   * @param userId The ID of the user whose invitations are being fetched.
   * @param type 'received', 'sent', or 'all'.
   * @returns An array of partnership invitations with relevant details.
   */
  static async findUserInvitations(
    userId: string,
    type: 'received' | 'sent' | 'all'
  ): Promise<PartnershipInvitationWithDetails[]> {
    let whereClause: any;

    switch (type) {
      case 'received':
        whereClause = { receiverId: userId, status: 'PENDING' };
        break;
      case 'sent':
        whereClause = { senderId: userId };
        break;
      case 'all':
        whereClause = {
          OR: [
            { receiverId: userId },
            { senderId: userId }
          ]
        };
        break;
      default:
        // This case should ideally be caught by Zod in the route, but as a fallback:
        throw new Error('Invalid invitation type specified. Must be "received", "sent", or "all".');
    }

    const invitations = await prisma.partnershipInvitation.findMany({
      where: whereClause,
      include: {
        sender: {
          select: { id: true, name: true, email: true, image: true }
        },
        receiver: {
          select: { id: true, name: true, email: true, image: true }
        },
        asset: {
          select: { id: true, assetName: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return invitations as PartnershipInvitationWithDetails[];
  }
}
// src/app/api/users/[userId]/invitations/[invitationId]/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next'; // Import getServerSession
import { authOptions } from '@/lib/auth'; // Import your authOptions

// PUT - Accept or reject invitation
export async function PUT(
    req: Request,
    { params }: { params: { invitationId: string } } // Using 'invitationId' for clarity
) {
    try {
        const { invitationId } = params;
        const body = await req.json();
        const { action } = body; // 'accept' or 'reject'

        // --- Authorization Check ---
        const session = await getServerSession(authOptions); // <-- THIS IS THE KEY CHANGE
        const currentUserId = session?.user?.id;

        if (!currentUserId) {
            return NextResponse.json({ message: 'Unauthorized: User not authenticated.' }, { status: 401 });
        }
        // End Authorization Check

        if (!action || !['accept', 'reject'].includes(action)) {
            return NextResponse.json({
                message: 'Invalid action. Must be "accept" or "reject".'
            }, { status: 400 });
        }

        const invitation = await prisma.partnershipInvitation.findUnique({
            where: { id: invitationId },
            include: { asset: true }
        });

        // Crucial check: invitation must exist AND belong to the current authenticated user as the receiver.
        if (!invitation || invitation.receiverId !== currentUserId) {
            // It's good to use 404 for "not found" or "not accessible" to avoid leaking info
            return NextResponse.json({ message: 'Invitation not found or not for this user.' }, { status: 404 });
        }

        if (invitation.status !== 'PENDING') {
            return NextResponse.json({ message: `Invitation has already been ${invitation.status.toLowerCase()}.` }, { status: 400 });
        }

        if (invitation.expiresAt && invitation.expiresAt < new Date()) {
            // If expired, update status and return error
            await prisma.partnershipInvitation.update({
                where: { id: invitationId },
                data: { status: 'EXPIRED', message: 'Invitation expired.' }
            });
            return NextResponse.json({ message: 'Invitation has expired.' }, { status: 400 });
        }

        let updatedInvitation;

        if (action === 'accept') {
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
                return NextResponse.json({
                    message: `Cannot accept invitation: Total active share for asset ${invitation.asset.assetName} would be ${totalAfterAccept.toFixed(2)}%, exceeding 100%. Invitation rejected.`,
                    status: 'rejected'
                }, { status: 400 });
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

            return NextResponse.json({
                message: 'Partnership invitation accepted successfully. You are now a partner in this asset.',
                invitation: updatedInvitation
            }, { status: 200 });

        } else { // action === 'reject'
            updatedInvitation = await prisma.partnershipInvitation.update({
                where: { id: invitationId },
                data: { status: 'REJECTED' }
            });
            return NextResponse.json({
                message: 'Partnership invitation rejected.',
                invitation: updatedInvitation
            }, { status: 200 });
        }
    } catch (error: any) {
        console.error('Error handling partnership invitation:', error);
        if (error.code === 'P2025') {
            return NextResponse.json({ message: 'Invitation not found.' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Failed to handle invitation.' }, { status: 500 });
    }
}
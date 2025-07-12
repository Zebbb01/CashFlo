// src/app/api/users/[userId]/invitations/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

/**
 * GET - Fetch user invitations (received, sent, or all)
 * This route handles requests to /api/users/[userId]/invitations?type=[type]
 * It fetches a list of invitations relevant to the specified user.
 */
export async function GET(
    req: Request,
    { params }: { params: { userId: string } }
) {
    try {
        // --- FIX: Await params before destructuring ---
        const resolvedParams = await params; // Await the params object
        const { userId } = resolvedParams;    // Destructure from the awaited object
        // --- End FIX ---

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type'); // 'received', 'sent', or 'all'

        // --- Authorization Check ---
        // Ensure the authenticated user is requesting their own invitations.
        const session = await getServerSession(authOptions);
        const currentUserId = session?.user?.id;

        if (!currentUserId || currentUserId !== userId) {
            return NextResponse.json({ message: 'Unauthorized: You can only view your own invitations.' }, { status: 403 });
        }
        // End Authorization Check

        let invitations;

        switch (type) {
            case 'received':
                invitations = await prisma.partnershipInvitation.findMany({
                    where: {
                        receiverId: userId,
                        status: 'PENDING',
                    },
                    include: {
                        sender: {
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
                break;
            case 'sent':
                invitations = await prisma.partnershipInvitation.findMany({
                    where: {
                        senderId: userId,
                    },
                    include: {
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
                break;
            case 'all':
                invitations = await prisma.partnershipInvitation.findMany({
                    where: {
                        OR: [
                            { receiverId: userId },
                            { senderId: userId }
                        ]
                    },
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
                break;
            default:
                return NextResponse.json({ message: 'Invalid invitation type specified. Must be "received", "sent", or "all".' }, { status: 400 });
        }

        return NextResponse.json(invitations, { status: 200 });

    } catch (error) {
        console.error('Error fetching user invitations:', error);
        return NextResponse.json({ message: 'Failed to fetch invitations.' }, { status: 500 });
    }
}
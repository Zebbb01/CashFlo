// src/app/api/users/[userId]/invitations/route.ts
import { withMiddleware } from '@/lib/api-middleware';
import { InvitationService } from '@/lib/services/invitation.service';
import { NextResponse } from 'next/server';

/**
 * GET - Fetch user invitations (received, sent, or all)
 * This route handles requests to /api/users/[userId]/invitations?type=[type]
 * It fetches a list of invitations relevant to the specified user.
 */
export const GET = withMiddleware(async (req, { params }) => {
  try {
    const { userId } = params; // params is already resolved by Next.js/route handlers

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'received', 'sent', or 'all'

    // `withMiddleware` should already handle session and currentUserId,
    // making `req.user.id` available if authentication is successful.
    const currentUserId = req.user?.id;

    if (!currentUserId || currentUserId !== userId) {
      return NextResponse.json({ error: 'Unauthorized: You can only view your own invitations.' }, { status: 403 });
    }

    if (!type || !['received', 'sent', 'all'].includes(type)) {
      return NextResponse.json({ error: 'Invalid invitation type specified. Must be "received", "sent", or "all".' }, { status: 400 });
    }

    const invitations = await InvitationService.findUserInvitations(userId, type as 'received' | 'sent' | 'all');
    return NextResponse.json(invitations, { status: 200 });

  } catch (error) {
    console.error('Error fetching user invitations:', error);
    return NextResponse.json({ error: 'Failed to fetch invitations.' }, { status: 500 });
  }
});
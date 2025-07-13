// src/app/api/users/[userId]/invitations/[invitationId]/route.ts
import { withMiddleware } from '@/lib/api-middleware';
import { InvitationService } from '@/lib/services/invitation.service';
import { updateInvitationSchema } from '@/lib/validations/invitation.validation';
import { NextResponse } from 'next/server';

// PUT - Accept or reject invitation
export const PUT = withMiddleware(async (req, { params }) => {
  try {
    const { invitationId } = params;
    const body = await req.json();

    // Validate the action using Zod
    const { action } = updateInvitationSchema.parse(body);

    // `withMiddleware` should already handle session and currentUserId,
    // making `req.user.id` available if authentication is successful.
    // Assuming `req.user` is populated by `withMiddleware`.
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized: User not authenticated.' }, { status: 401 });
    }

    const result = await InvitationService.handleInvitationResponse(
      invitationId,
      currentUserId,
      action
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Error handling partnership invitation:', error);
    // Align error responses with the `withMiddleware` format
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error.message.includes('not found') || error.message.includes('not for this user')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error.message.includes('already been') || error.message.includes('expired') || error.message.includes('exceeding 100%')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to handle invitation.' }, { status: 500 });
  }
});
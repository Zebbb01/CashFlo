// src/app/api/users/[userId]/invitations/[invitationId]/route.ts
import { withMiddleware } from '@/lib/api-middleware';
import { InvitationService } from '@/lib/services/invitation.service';
import { updateInvitationSchema } from '@/lib/validations/invitation.validation';
import { NextResponse } from 'next/server';

// PUT - Accept or reject invitation
export const PUT = withMiddleware(async (req, { params }) => {
  try {
    // Await params to resolve the promise
    const resolvedParams = await params;
    const { invitationId } = resolvedParams;
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
  } catch (error: unknown) {
    console.error('Error handling partnership invitation:', error);
    // Align error responses with the `withMiddleware` format
    if (typeof error === 'object' && error !== null && 'name' in error && (error as { name?: string }).name === 'ZodError') {
      const zodErrors = (error as { errors?: Array<{ message: string }> }).errors;
      const errorMsg = Array.isArray(zodErrors) ? zodErrors.map(e => e.message).join(', ') : 'Validation failed';
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('not found') || errorMessage.includes('not for this user')) {
      return NextResponse.json({ error: errorMessage }, { status: 404 });
    }
    if (errorMessage.includes('already been') || errorMessage.includes('expired') || errorMessage.includes('exceeding 100%')) {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to handle invitation.' }, { status: 500 });
  }
});
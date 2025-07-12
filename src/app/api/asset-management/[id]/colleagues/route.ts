// src/app/api/asset-management/[id]/colleagues/route.ts
import { withMiddleware } from '@/lib/api-middleware';
import { PartnershipService, AssetService } from '@/lib/services';
import { invitationSchema } from '@/lib/validations/asset.validation';
import { NextResponse } from 'next/server';

export const GET = withMiddleware(async (req, { params }) => {
  const { id: assetId } = await params;
  
  const result = await PartnershipService.getAssetPartnerships(assetId);
  if (!result) {
    return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
  }

  return NextResponse.json(result);
});

export const POST = withMiddleware(async (req, { params }) => {
  const { id: assetId } = await params;
  const body = await req.json();
  const validatedData = invitationSchema.parse(body);

  // Check authorization
  if (!(await AssetService.checkOwnership(assetId, req.user.id))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const invitation = await PartnershipService.createInvitation({
    assetId,
    senderId: req.user.id,
    ...validatedData
  });

  return NextResponse.json({
    message: 'Invitation sent successfully',
    invitation
  }, { status: 201 });
});
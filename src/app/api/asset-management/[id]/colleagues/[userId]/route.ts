// src/app/api/asset-management/[id]/colleagues/[userId]/route.ts
import { withMiddleware } from '@/lib/api-middleware';
import { PartnershipService, AssetService } from '@/lib/services';
import { partnershipUpdateSchema } from '@/lib/validations/asset.validation';
import { NextResponse } from 'next/server';

export const GET = withMiddleware(async (req, { params }) => {
  const { id: assetId, userId } = await params;
  
  const result = await PartnershipService.getPartnershipDetails(assetId, userId);
  if (!result) {
    return NextResponse.json({ error: 'Partnership not found' }, { status: 404 });
  }

  return NextResponse.json(result);
});

export const PUT = withMiddleware(async (req, { params }) => {
  const { id: assetId, userId } = await params;
  const body = await req.json();
  const validatedData = partnershipUpdateSchema.parse(body);

  // Check authorization
  if (!(await AssetService.checkOwnership(assetId, req.user.id))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const partnership = await PartnershipService.updatePartnership(assetId, userId, validatedData);
  if (!partnership) {
    return NextResponse.json({ error: 'Partnership not found' }, { status: 404 });
  }

  return NextResponse.json({
    message: 'Partnership updated successfully',
    partnership
  });
});

export const DELETE = withMiddleware(async (req, { params }) => {
  const { id: assetId, userId } = await params;

  // Check authorization
  if (!(await AssetService.checkOwnership(assetId, req.user.id))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await PartnershipService.updatePartnership(assetId, userId, { isActive: false });
  
  return NextResponse.json({
    message: 'Partner deactivated successfully'
  });
});
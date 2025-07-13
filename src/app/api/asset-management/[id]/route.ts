// src/app/api/asset-management/[id]/route.ts
import { withMiddleware } from '@/lib/api-middleware';
import { AssetService } from '@/lib/services'; 
import { updateAssetSchema } from '@/lib/validations/asset.validation';
import { NextResponse } from 'next/server';
import { AssetManagement, AssetPartnership} from '@prisma/client'; 

// Define a local type that includes the necessary relations for this route
type AssetWithPartnerships = AssetManagement & {
  partnerships: AssetPartnership[]; // We only need partnerships for this check
};

export const GET = withMiddleware(async (req, { params }) => {
  const { id } = await params;

  const asset = await AssetService.findById(id, true); // Still explicitly pass true
  if (!asset) {
    return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
  }

  // Type guard or assertion:
  // We need to ensure that 'asset' actually has the 'partnerships' property
  // before trying to access it. The `findById` now explicitly states its return type.
  // If `includeRelations` is true, 'partnerships' should be present.
  // We can safely cast it here for TypeScript's sake since we know the context.
  const assetWithPartnerships = asset as AssetWithPartnerships; // Cast to the type with partnerships

  // Authorization check
  const isOwner = assetWithPartnerships.userId === req.user.id;
  const isPartner = assetWithPartnerships.partnerships.some(p => p.userId === req.user.id && p.isActive);

  if (!isOwner && !isPartner) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json(asset); // Return the original 'asset' if you want a leaner response
  // Or return NextResponse.json(assetWithPartnerships); if you want to include partnerships in the response
});

export const PUT = withMiddleware(async (req, { params }) => {
  const { id } = await params;
  const body = await req.json();
  const validatedData = updateAssetSchema.parse(body);

  // Check ownership
  if (!(await AssetService.checkOwnership(id, req.user.id))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const asset = await AssetService.update(id, validatedData);
  return NextResponse.json(asset);
});

export const PATCH = withMiddleware(async (req, { params }) => {
  const { id } = await params;
  const { softDelete } = await req.json();

  if (!(await AssetService.checkOwnership(id, req.user.id))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const asset = softDelete
    ? await AssetService.softDelete(id)
    : await AssetService.restore(id);

  return NextResponse.json(asset);
});

export const DELETE = withMiddleware(async (req, { params }) => {
  const { id } = await params;

  if (!(await AssetService.checkOwnership(id, req.user.id))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await AssetService.delete(id);
  return NextResponse.json({ message: 'Asset deleted successfully' });
});
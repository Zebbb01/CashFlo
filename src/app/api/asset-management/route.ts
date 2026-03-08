// src/app/api/asset-management/route.ts
import { withMiddleware } from '@/lib/api-middleware';
import { AssetService } from '@/lib/services/asset.service';
import { createAssetSchema } from '@/lib/validations/asset.validation';
import { NextResponse } from 'next/server';

export const GET = withMiddleware(async (req) => {
  const url = new URL(req.url);
  const includeDeleted = url.searchParams.get('includeDeleted') === 'true';
  const userId = req.user?.id; // Extract from authenticated session

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const assets = await AssetService.findAll({ includeDeleted, userId });
  return NextResponse.json(assets);
});

export const POST = withMiddleware(async (req) => {
  const body = await req.json();
  const validatedData = createAssetSchema.parse(body);

  const asset = await AssetService.create(validatedData);
  return NextResponse.json(asset, { status: 201 });
});
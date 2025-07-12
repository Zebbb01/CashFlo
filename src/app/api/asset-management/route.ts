// src/app/api/asset-management/route.ts
import { withMiddleware } from '@/lib/api-middleware';
import { AssetService } from '@/lib/services/asset.service';
import { createAssetSchema } from '@/lib/validations/asset.validation';
import { NextResponse } from 'next/server';

export const GET = withMiddleware(async (req, context) => {
  const url = new URL(req.url);
  const includeDeleted = url.searchParams.get('includeDeleted') === 'true';
  
  const assets = await AssetService.findAll({ includeDeleted });
  return NextResponse.json(assets);
});

export const POST = withMiddleware(async (req, context) => {
  const body = await req.json();
  const validatedData = createAssetSchema.parse(body);
  
  const asset = await AssetService.create(validatedData);
  return NextResponse.json(asset, { status: 201 });
});
import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

// GET all assets (excluding soft-deleted by default)
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const includeDeleted = url.searchParams.get('includeDeleted') === 'true';

    const assets = await prisma.assetManagement.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      include: { company: true }, // Optionally include related company
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(assets, { status: 200 });
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json({ message: 'Failed to fetch assets' }, { status: 500 });
  }
}

// POST a new asset
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { assetType, companyId, assetName, assetValue } = body;

    if (!assetType || !companyId || !assetName || assetValue === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    if (typeof assetValue !== 'number') {
      return NextResponse.json({ message: 'Asset value must be a number' }, { status: 400 });
    }

    // Check if companyId exists
    const companyExists = await prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!companyExists) {
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }

    const newAsset = await prisma.assetManagement.create({
      data: {
        assetType,
        companyId,
        assetName,
        assetValue,
      },
    });
    return NextResponse.json(newAsset, { status: 201 });
  } catch (error) {
    console.error('Error creating asset:', error);
    return NextResponse.json({ message: 'Failed to create asset' }, { status: 500 });
  }
}
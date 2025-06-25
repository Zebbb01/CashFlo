import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

// GET a single asset by ID (can retrieve soft-deleted assets)
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const asset = await prisma.assetManagement.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!asset) {
      return NextResponse.json({ message: 'Asset not found' }, { status: 404 });
    }
    return NextResponse.json(asset, { status: 200 });
  } catch (error) {
    console.error('Error fetching asset:', error);
    return NextResponse.json({ message: 'Failed to fetch asset' }, { status: 500 });
  }
}

// PUT (Full Update) an asset by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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

    const updatedAsset = await prisma.assetManagement.update({
      where: { id },
      data: {
        assetType,
        companyId,
        assetName,
        assetValue,
        deletedAt: null, // Ensure it's not soft-deleted on full update
      },
    });
    return NextResponse.json(updatedAsset, { status: 200 });
  } catch (error: any) {
    console.error('Error updating asset:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Asset not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Failed to update asset' }, { status: 500 });
  }
}

// PATCH (Soft Delete / Restore) an asset by ID
// This endpoint handles soft deletion by setting deletedAt or restoring by setting it to null.
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { softDelete, ...updateData } = body; // `softDelete` is a boolean flag to indicate soft deletion

    let dataToUpdate: { deletedAt?: Date | null; [key: string]: any } = {};

    if (softDelete !== undefined) {
      dataToUpdate.deletedAt = softDelete ? new Date() : null;
    }

    // Allow other fields to be updated partially as well, if needed
    Object.assign(dataToUpdate, updateData);

    const updatedAsset = await prisma.assetManagement.update({
      where: { id },
      data: dataToUpdate,
    });
    return NextResponse.json(updatedAsset, { status: 200 });
  } catch (error: any) {
    console.error('Error patching asset:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Asset not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Failed to update asset' }, { status: 500 });
  }
}


// DELETE (Hard Delete) an asset by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.assetManagement.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Asset deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting asset:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Asset not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Failed to delete asset' }, { status: 500 });
  }
}
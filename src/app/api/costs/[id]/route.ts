// src/app/api/costs/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET a single cost by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const cost = await prisma.cost.findUnique({
      where: { id },
      include: {
        bankAssetManagement: {
          include: {
            bank: true, // Include bank details if desired
            company: true, // Include company details for the asset if desired
          },
        },
        user: true,
      },
    });

    if (!cost) {
      return NextResponse.json({ message: 'Cost not found' }, { status: 404 });
    }
    return NextResponse.json(cost, { status: 200 });
  } catch (error) {
    console.error('Error fetching cost:', error);
    return NextResponse.json({ message: 'Failed to fetch cost' }, { status: 500 });
  }
}

// PUT (Full Update) a cost by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { category, amount, date, description, bankAssetManagementId, userId } = body;

    if (!category || amount === undefined) {
      return NextResponse.json({ message: 'Category and amount are required' }, { status: 400 });
    }
    if (typeof amount !== 'number') {
      return NextResponse.json({ message: 'Amount must be a number' }, { status: 400 });
    }
    // Cost must be linked to a bank's asset management
    if (!bankAssetManagementId) {
      return NextResponse.json({ message: 'Cost must be linked to a bank asset management.' }, { status: 400 });
    }

    // Validate bankAssetManagementId if provided
    if (bankAssetManagementId !== undefined && bankAssetManagementId !== null) {
      const assetExists = await prisma.assetManagement.findUnique({ where: { id: bankAssetManagementId } });
      if (!assetExists) {
        return NextResponse.json({ message: 'Bank Asset Management not found' }, { status: 404 });
      }
    }

    // Validate userId if provided
    if (userId !== undefined && userId !== null) {
      const userExists = await prisma.user.findUnique({ where: { id: userId } });
      if (!userExists) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
    }

    const updatedCost = await prisma.cost.update({
      where: { id },
      data: {
        category,
        amount,
        date: date ? new Date(date) : undefined,
        description,
        bankAssetManagement: bankAssetManagementId !== undefined ? (bankAssetManagementId ? { connect: { id: bankAssetManagementId } } : { disconnect: true }) : undefined,
        user: userId !== undefined ? (userId ? { connect: { id: userId } } : { disconnect: true }) : undefined,
      },
    });
    return NextResponse.json(updatedCost, { status: 200 });
  } catch (error: any) {
    console.error('Error updating cost:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Cost not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Failed to update cost' }, { status: 500 });
  }
}

// DELETE (Hard Delete) a cost by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.cost.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Cost deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting cost:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Cost not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Failed to delete cost' }, { status: 500 });
  }
}
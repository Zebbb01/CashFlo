// src/app/api/revenues/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET a single revenue by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const revenue = await prisma.revenue.findUnique({
      where: { id },
      include: {
        bankAssetManagement: true,
        user: true,
      },
    });

    if (!revenue) {
      return NextResponse.json({ message: 'Revenue not found' }, { status: 404 });
    }
    return NextResponse.json(revenue, { status: 200 });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    return NextResponse.json({ message: 'Failed to fetch revenue' }, { status: 500 });
  }
}

// PUT (Full Update) a revenue by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { source, amount, date, description, bankAssetManagementId, userId } = body; // Changed from companyId, assetManagementId

    if (!source || amount === undefined) {
      return NextResponse.json({ message: 'Source and amount are required' }, { status: 400 });
    }
    if (typeof amount !== 'number') {
      return NextResponse.json({ message: 'Amount must be a number' }, { status: 400 });
    }
    // Revenue must be linked to a bank's asset management
    if (!bankAssetManagementId) {
      return NextResponse.json({ message: 'Revenue must be linked to a bank asset management.' }, { status: 400 });
    }

    // Validate bankAssetManagementId
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

    const updatedRevenue = await prisma.revenue.update({
      where: { id },
      data: {
        source,
        amount,
        date: date ? new Date(date) : undefined,
        description,
        bankAssetManagement: bankAssetManagementId !== undefined ? (bankAssetManagementId ? { connect: { id: bankAssetManagementId } } : { disconnect: true }) : undefined,
        user: userId !== undefined ? (userId ? { connect: { id: userId } } : { disconnect: true }) : undefined,
      },
    });
    return NextResponse.json(updatedRevenue, { status: 200 });
  } catch (error: any) {
    console.error('Error updating revenue:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Revenue not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Failed to update revenue' }, { status: 500 });
  }
}

// DELETE (Hard Delete) a revenue by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.revenue.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Revenue deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting revenue:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Revenue not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Failed to delete revenue' }, { status: 500 });
  }
}
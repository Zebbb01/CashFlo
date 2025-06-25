// src/app/api/revenue/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET a single revenue entry by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const revenue = await prisma.revenue.findUnique({
      where: { id },
      include: { company: true, asset: true, user: true }, // Include related data
    });

    if (!revenue) {
      return NextResponse.json({ message: 'Revenue entry not found' }, { status: 404 });
    }
    return NextResponse.json(revenue, { status: 200 });
  } catch (error) {
    console.error('Error fetching revenue entry:', error);
    return NextResponse.json({ message: 'Failed to fetch revenue entry' }, { status: 500 });
  }
}

// PUT (Full Update) a revenue entry by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { source, amount, date, description, companyId, assetId, userId } = body;

    if (!source || amount === undefined) {
      return NextResponse.json({ message: 'Missing required fields: source, amount' }, { status: 400 });
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ message: 'Amount must be a positive number' }, { status: 400 });
    }

    // Optional: Validate companyId if provided
    if (companyId) {
      const companyExists = await prisma.company.findUnique({ where: { id: companyId } });
      if (!companyExists) {
        return NextResponse.json({ message: 'Company not found' }, { status: 404 });
      }
    }
    // Optional: Validate assetId if provided
    if (assetId) {
      const assetExists = await prisma.assetManagement.findUnique({ where: { id: assetId } });
      if (!assetExists) {
        return NextResponse.json({ message: 'Asset not found' }, { status: 404 });
      }
    }
    // Optional: Validate userId if provided
    if (userId) {
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
        date: date ? new Date(date) : undefined, // Update date if provided
        description,
        company: companyId ? { connect: { id: companyId } } : { disconnect: true },
        asset: assetId ? { connect: { id: assetId } } : { disconnect: true },
        user: userId ? { connect: { id: userId } } : { disconnect: true },
      },
    });
    return NextResponse.json(updatedRevenue, { status: 200 });
  } catch (error: any) {
    console.error('Error updating revenue entry:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Revenue entry not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Failed to update revenue entry' }, { status: 500 });
  }
}

// DELETE a revenue entry by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.revenue.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Revenue entry deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting revenue entry:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Revenue entry not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Failed to delete revenue entry' }, { status: 500 });
  }
}
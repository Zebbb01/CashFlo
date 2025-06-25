// src/app/api/costs/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET a single cost entry by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const cost = await prisma.cost.findUnique({
      where: { id },
      include: { company: true, asset: true, user: true }, // Include related data
    });

    if (!cost) {
      return NextResponse.json({ message: 'Cost entry not found' }, { status: 404 });
    }
    return NextResponse.json(cost, { status: 200 });
  } catch (error) {
    console.error('Error fetching cost entry:', error);
    return NextResponse.json({ message: 'Failed to fetch cost entry' }, { status: 500 });
  }
}

// PUT (Full Update) a cost entry by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { category, amount, date, description, companyId, assetId, userId } = body;

    if (!category || amount === undefined) {
      return NextResponse.json({ message: 'Missing required fields: category, amount' }, { status: 400 });
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

    const updatedCost = await prisma.cost.update({
      where: { id },
      data: {
        category,
        amount,
        date: date ? new Date(date) : undefined, // Update date if provided
        description,
        company: companyId ? { connect: { id: companyId } } : { disconnect: true },
        asset: assetId ? { connect: { id: assetId } } : { disconnect: true },
        user: userId ? { connect: { id: userId } } : { disconnect: true },
      },
    });
    return NextResponse.json(updatedCost, { status: 200 });
  } catch (error: any) {
    console.error('Error updating cost entry:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Cost entry not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Failed to update cost entry' }, { status: 500 });
  }
}

// DELETE a cost entry by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.cost.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Cost entry deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting cost entry:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Cost entry not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Failed to delete cost entry' }, { status: 500 });
  }
}
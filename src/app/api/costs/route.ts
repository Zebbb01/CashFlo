// src/app/api/costs/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all cost entries
export async function GET(req: Request) {
  try {
    const costs = await prisma.cost.findMany({
      include: { company: true, user: true, asset: true }, // Added asset: true
      orderBy: {
        date: 'desc',
      },
    });
    return NextResponse.json(costs, { status: 200 });
  } catch (error) {
    console.error('Error fetching costs:', error);
    return NextResponse.json({ message: 'Failed to fetch costs' }, { status: 500 });
  }
}

// POST a new cost entry
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, amount, date, description, companyId, userId, assetId } = body;

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

    // Optional: Validate userId if provided
    if (userId) {
      const userExists = await prisma.user.findUnique({ where: { id: userId } });
      if (!userExists) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
    }

    // Optional: Validate assetId if provided - ADDED THIS VALIDATION
    if (assetId) {
      const assetExists = await prisma.assetManagement.findUnique({ where: { id: assetId } });
      if (!assetExists) {
        return NextResponse.json({ message: 'Asset not found' }, { status: 404 });
      }
    }

    const newCost = await prisma.cost.create({
      data: {
        category,
        amount,
        date: date ? new Date(date) : new Date(),
        description,
        companyId,
        userId,
        assetId, // This will now properly save the assetId instead of being undefined
      },
    });
    return NextResponse.json(newCost, { status: 201 });
  } catch (error) {
    console.error('Error creating cost:', error);
    return NextResponse.json({ message: 'Failed to create cost' }, { status: 500 });
  }
}
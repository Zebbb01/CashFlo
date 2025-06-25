// src/app/api/revenue/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all revenue entries
export async function GET(req: Request) {
  try {
    const revenues = await prisma.revenue.findMany({
      include: { company: true, user: true, asset: true }, // Include related company, user, and asset data
      orderBy: {
        date: 'desc',
      },
    });
    return NextResponse.json(revenues, { status: 200 });
  } catch (error) {
    console.error('Error fetching revenues:', error);
    return NextResponse.json({ message: 'Failed to fetch revenues' }, { status: 500 });
  }
}

// POST a new revenue entry
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { source, amount, date, description, companyId, userId, assetId } = body; // Added assetId here

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

    const newRevenue = await prisma.revenue.create({
      data: {
        source,
        amount,
        date: date ? new Date(date) : new Date(),
        description,
        companyId,
        userId,
        assetId, // Changed from null to assetId to properly save the asset relationship
      },
    });
    return NextResponse.json(newRevenue, { status: 201 });
  } catch (error) {
    console.error('Error creating revenue:', error);
    return NextResponse.json({ message: 'Failed to create revenue' }, { status: 500 });
  }
}
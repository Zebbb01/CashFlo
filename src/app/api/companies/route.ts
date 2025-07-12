// src/app/api/companies/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all companies
export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      // Removed include: { revenues: true, costs: true }
    });

    // Removed calculations for totalCompanyRevenue, totalCompanyCost, and companyNetIncome
    // as Revenue and Cost are no longer directly related to Company in the schema.
    // If you need these, you would calculate them by aggregating costs/revenues
    // linked to assets that belong to these companies, or re-introduce a direct relation
    // in the schema if that's what's truly desired.

    return NextResponse.json(companies, { status: 200 });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ message: 'Failed to fetch companies' }, { status: 500 });
  }
}

// POST a new company
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

    const newCompany = await prisma.company.create({
      data: {
        name,
        description,
      },
    });
    return NextResponse.json(newCompany, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ message: 'Failed to create company' }, { status: 500 });
  }
}
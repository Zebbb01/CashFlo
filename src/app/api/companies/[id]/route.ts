// src/app/api/companies/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET a single company by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        assets: true, // Include related assets (this relation still exists on Company)
      },
    });

    if (!company) {
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }

    // Removed calculations for totalCompanyRevenue, totalCompanyCost, and companyNetIncome
    // as Revenue and Cost are no longer directly related to Company in the schema.
    // If you need these, you would calculate them by aggregating costs/revenues
    // linked to assets that belong to this company, or re-introduce a direct relation
    // in the schema if that's what's truly desired.

    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json({ message: 'Failed to fetch company' }, { status: 500 });
  }
}

// PUT (Full Update) a company by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

    const updatedCompany = await prisma.company.update({
      where: { id },
      data: {
        name,
        description,
      },
    });
    return NextResponse.json(updatedCompany, { status: 200 });
  } catch (error: any) {
    console.error('Error updating company:', error);
    if (error.code === 'P2025') { // Prisma error code for record not found
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Failed to update company' }, { status: 500 });
  }
}

// DELETE (Hard Delete) a company by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.company.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Company deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting company:', error);
    if (error.code === 'P2025') { // Prisma error code for record not found
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Failed to delete company' }, { status: 500 });
  }
}
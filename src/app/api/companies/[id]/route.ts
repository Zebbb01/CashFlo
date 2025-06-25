import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

// GET a single company by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const company = await prisma.company.findUnique({
      where: { id },
      include: { assets: true }, // Optionally include related assets
    });

    if (!company) {
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }
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
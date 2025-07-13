// src/app/api/companies/[id]/route.ts
import { withMiddleware } from '@/lib/api-middleware';
import { CompanyService } from '@/lib/services/company.service';
import { updateCompanySchema } from '@/lib/validations/company.validation';
import { NextResponse } from 'next/server';

export const GET = withMiddleware(async (req, { params }) => {
  try {
    const { id } = params;
    const company = await CompanyService.findById(id);

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 });
  }
});

export const PUT = withMiddleware(async (req, { params }) => {
  try {
    const { id } = params;
    const body = await req.json();
    const validatedData = updateCompanySchema.parse(body);

    const updatedCompany = await CompanyService.update(id, validatedData);
    return NextResponse.json(updatedCompany, { status: 200 });
  } catch (error: any) {
    console.error('Error updating company:', error);
    if (error.code === 'P2025') { // Prisma error code for record not found
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
  }
});

export const DELETE = withMiddleware(async (req, { params }) => {
  try {
    const { id } = params;
    await CompanyService.delete(id);
    return NextResponse.json({ error: 'Company deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting company:', error);
    if (error.code === 'P2025') { // Prisma error code for record not found
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 });
  }
});
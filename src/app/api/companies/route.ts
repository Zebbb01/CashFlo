// src/app/api/companies/route.ts
import { withMiddleware } from '@/lib/api-middleware';
import { CompanyService } from '@/lib/services/company.service';
import { createCompanySchema } from '@/lib/validations/company.validation';
import { NextResponse } from 'next/server';

export const GET = withMiddleware(async (req) => {
  try {
    const userId = req.user.id;
    const companies = await CompanyService.findAll(userId);
    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    // Changed 'message' to 'error'
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
});

export const POST = withMiddleware(async (req) => {
  try {
    const body = await req.json();
    const validatedData = createCompanySchema.parse(body);

    const newCompany = await CompanyService.create(validatedData);
    return NextResponse.json(newCompany, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating company:', error);
    // Check if error is an object and has a code property safely
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Company with this name already exists' }, { status: 409 });
    }
    // Changed 'message' to 'error' for consistency with middleware expectation
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
});
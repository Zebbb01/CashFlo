// src/app/api/banks/route.ts
import { withMiddleware } from '@/lib/api-middleware';
import { BankService } from '@/lib/services/bank.service';
import { createBankSchema } from '@/lib/validations/bank.validation';
import { NextResponse } from 'next/server';

export const GET = withMiddleware(async () => {
  try {
    const banks = await BankService.findAll();
    return NextResponse.json(banks);
  } catch (error) {
    console.error('Error fetching banks:', error);
    return NextResponse.json({ error: 'Failed to fetch banks' }, { status: 500 });
  }
});

export const POST = withMiddleware(async (req) => {
  try {
    const body = await req.json();
    const validatedData = createBankSchema.parse(body);

    const newBank = await BankService.create(validatedData);
    return NextResponse.json(newBank, { status: 201 });
  } catch (error: any) {
    console.error('Error creating bank:', error);
    if (error.code === 'P2002') { // Prisma error code for unique constraint violation
      return NextResponse.json({ error: 'Bank with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create bank' }, { status: 500 });
  }
});
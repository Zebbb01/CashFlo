// src/app/api/banks/[id]/route.ts
import { withMiddleware } from '@/lib/api-middleware';
import { BankService } from '@/lib/services/bank.service';
import { updateBankSchema } from '@/lib/validations/bank.validation';
import { NextResponse } from 'next/server';

export const GET = withMiddleware(async (req, { params }) => {
  try {
    const { id } = params;
    const bank = await BankService.findById(id);

    if (!bank) {
      return NextResponse.json({ error: 'Bank not found' }, { status: 404 });
    }

    return NextResponse.json(bank, { status: 200 });
  } catch (error) {
    console.error('Error fetching bank:', error);
    return NextResponse.json({ error: 'Failed to fetch bank' }, { status: 500 });
  }
});

export const PUT = withMiddleware(async (req, { params }) => {
  try {
    const { id } = params;
    const body = await req.json();
    const validatedData = updateBankSchema.parse(body);

    const updatedBank = await BankService.update(id, validatedData);
    return NextResponse.json(updatedBank, { status: 200 });
  } catch (error: any) {
    console.error('Error updating bank:', error);
    if (error.code === 'P2025') { // Prisma error code for record not found
      return NextResponse.json({ error: 'Bank not found' }, { status: 404 });
    }
    if (error.code === 'P2002') { // Prisma error code for unique constraint violation
      return NextResponse.json({ error: 'Bank with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update bank' }, { status: 500 });
  }
});

export const DELETE = withMiddleware(async (req, { params }) => {
  try {
    const { id } = params;
    await BankService.delete(id);
    return NextResponse.json({ message: 'Bank deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting bank:', error);
    if (error.code === 'P2025') { // Prisma error code for record not found
      return NextResponse.json({ error: 'Bank not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete bank' }, { status: 500 });
  }
});
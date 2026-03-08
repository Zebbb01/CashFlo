// src/app/api/costs/[id]/route.ts
import { withMiddleware } from '@/lib/api-middleware';
import { CostService } from '@/lib/services/cost.service';
import { updateCostSchema } from '@/lib/validations/cost.validation';
import { NextResponse } from 'next/server';

export const GET = withMiddleware(async (req, { params }) => {
  try {
    const { id } = await params;
    const cost = await CostService.findById(id);

    if (!cost) {
      // Changed 'message' to 'error'
      return NextResponse.json({ error: 'Cost not found' }, { status: 404 });
    }
    return NextResponse.json(cost, { status: 200 });
  } catch (error) {
    console.error('Error fetching cost:', error);
    // Changed 'message' to 'error'
    return NextResponse.json({ error: 'Failed to fetch cost' }, { status: 500 });
  }
});

export const PUT = withMiddleware(async (req, { params }) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = updateCostSchema.parse(body);

    const updatedCost = await CostService.update(id, validatedData);
    return NextResponse.json(updatedCost, { status: 200 });
  } catch (error: unknown) {
    console.error('Error updating cost:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'P2025') {
      // Changed 'message' to 'error'
      return NextResponse.json({ error: 'Cost not found' }, { status: 404 });
    }
    // Changed 'message' to 'error'
    return NextResponse.json({ error: 'Failed to update cost' }, { status: 500 });
  }
});

export const DELETE = withMiddleware(async (req, { params }) => {
  try {
    const { id } = await params;
    await CostService.delete(id);
    return NextResponse.json({ message: 'Cost deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error deleting cost:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'P2025') {
      // Changed 'message' to 'error'
      return NextResponse.json({ error: 'Cost not found' }, { status: 404 });
    }
    // Changed 'message' to 'error'
    return NextResponse.json({ error: 'Failed to delete cost' }, { status: 500 });
  }
});
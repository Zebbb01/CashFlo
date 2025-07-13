// src/app/api/revenues/[id]/route.ts
import { withMiddleware } from '@/lib/api-middleware';
import { RevenueService } from '@/lib/services/revenue.service';
import { updateRevenueSchema } from '@/lib/validations/revenue.validation';
import { NextResponse } from 'next/server';

export const GET = withMiddleware(async (req, { params }) => {
  try {
    const { id } = params;
    const revenue = await RevenueService.findById(id);

    if (!revenue) {
      // Changed 'message' to 'error'
      return NextResponse.json({ error: 'Revenue not found' }, { status: 404 });
    }
    return NextResponse.json(revenue, { status: 200 });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    // Changed 'message' to 'error'
    return NextResponse.json({ error: 'Failed to fetch revenue' }, { status: 500 });
  }
});

export const PUT = withMiddleware(async (req, { params }) => {
  try {
    const { id } = params;
    const body = await req.json();
    const validatedData = updateRevenueSchema.parse(body);

    const updatedRevenue = await RevenueService.update(id, validatedData);
    return NextResponse.json(updatedRevenue, { status: 200 });
  } catch (error: any) {
    console.error('Error updating revenue:', error);
    if (error.code === 'P2025') {
      // Changed 'message' to 'error'
      return NextResponse.json({ error: 'Revenue not found' }, { status: 404 });
    }
    // Changed 'message' to 'error'
    return NextResponse.json({ error: 'Failed to update revenue' }, { status: 500 });
  }
});

export const DELETE = withMiddleware(async (req, { params }) => {
  try {
    const { id } = params;
    await RevenueService.delete(id);
    return NextResponse.json({ message: 'Revenue deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting revenue:', error);
    if (error.code === 'P2025') {
      // Changed 'message' to 'error'
      return NextResponse.json({ error: 'Revenue not found' }, { status: 404 });
    }
    // Changed 'message' to 'error'
    return NextResponse.json({ error: 'Failed to delete revenue' }, { status: 500 });
  }
});
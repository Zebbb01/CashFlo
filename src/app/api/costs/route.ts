// src/app/api/costs/route.ts
import { withMiddleware } from '@/lib/api-middleware';
import { CostService } from '@/lib/services/cost.service';
import { createCostSchema } from '@/lib/validations/cost.validation';
import { NextResponse } from 'next/server';

export const GET = withMiddleware(async (req) => {
  try {
    const userId = req.user.id;
    const costs = await CostService.findAll(userId);
    return NextResponse.json(costs);
  } catch (error) {
    console.error('Error fetching costs:', error);
    return NextResponse.json({ error: 'Failed to fetch costs' }, { status: 500 });
  }
});

export const POST = withMiddleware(async (req) => {
  try {
    const body = await req.json();
    const validatedData = createCostSchema.parse(body);

    if (!validatedData.incurredByUserId) {
      return NextResponse.json({ error: 'User incurring cost is required.' }, { status: 400 });
    }

    const newCost = await CostService.create(validatedData);
    return NextResponse.json(newCost, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating cost:', error);
    // Aligning error message format with `withMiddleware` expectation
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('exceeds 100%') || errorMessage.includes('No valid users')) {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    // Changed 'message' to 'error'
    return NextResponse.json({ error: 'Failed to create cost' }, { status: 500 });
  }
});
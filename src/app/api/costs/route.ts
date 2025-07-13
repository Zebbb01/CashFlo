// src/app/api/costs/route.ts
import { withMiddleware } from '@/lib/api-middleware';
import { CostService } from '@/lib/services/cost.service';
import { createCostSchema } from '@/lib/validations/cost.validation';
import { NextResponse } from 'next/server';
// import { auth } from '@clerk/nextjs'; // Example: If using Clerk for auth

export const GET = withMiddleware(async () => {
  try {
    const costs = await CostService.findAll();
    return NextResponse.json(costs);
  } catch (error) {
    console.error('Error fetching costs:', error);
    // Changed 'message' to 'error'
    return NextResponse.json({ error: 'Failed to fetch costs' }, { status: 500 });
  }
});

export const POST = withMiddleware(async (req) => {
  try {
    const body = await req.json();
    const validatedData = createCostSchema.parse(body);

    // If using Clerk, uncomment and use:
    // const { userId: currentUserId } = auth();
    // if (!currentUserId) {
    //   return NextResponse.json({ error: 'Unauthorized: User incurring cost is required.' }, { status: 401 });
    // }
    // const newCost = await CostService.create({ ...validatedData, incurredByUserId: currentUserId });

    // For now, assuming incurredByUserId is provided in the request body for simplicity,
    // or you'll need to pass 'req.user.id' from your `withMiddleware` if it handles authentication.
    // Assuming `validatedData.incurredByUserId` exists based on schema or you get it from `req.user.id`
    if (!validatedData.incurredByUserId) { // Use incurredByUserId from validatedData
      return NextResponse.json({ error: 'User incurring cost is required.' }, { status: 400 });
    }

    const newCost = await CostService.create(validatedData);
    return NextResponse.json(newCost, { status: 201 });
  } catch (error: any) {
    console.error('Error creating cost:', error);
    // Aligning error message format with `withMiddleware` expectation
    if (error.message.includes('exceeds 100%') || error.message.includes('No valid users')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    // Changed 'message' to 'error'
    return NextResponse.json({ error: 'Failed to create cost' }, { status: 500 });
  }
});
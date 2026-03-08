// src/app/api/revenues/route.ts
import { withMiddleware } from '@/lib/api-middleware';
import { RevenueService } from '@/lib/services/revenue.service';
import { createRevenueSchema } from '@/lib/validations/revenue.validation';
import { NextResponse } from 'next/server';
// import { auth } from '@clerk/nextjs'; // Example: If using Clerk for auth

export const GET = withMiddleware(async (req) => {
  try {
    const userId = req.user.id;
    const revenues = await RevenueService.findAll(userId);
    return NextResponse.json(revenues);
  } catch (error) {
    console.error('Error fetching revenues:', error);
    // Changed 'message' to 'error'
    return NextResponse.json({ error: 'Failed to fetch revenues' }, { status: 500 });
  }
});

export const POST = withMiddleware(async (req) => {
  try {
    const body = await req.json();
    const validatedData = createRevenueSchema.parse(body);

    // If using Clerk, uncomment and use:
    // const { userId: currentUserId } = auth();
    // if (!currentUserId) {
    //   return NextResponse.json({ error: 'Unauthorized: User recording revenue is required.' }, { status: 401 });
    // }
    // const newRevenue = await RevenueService.create({ ...validatedData, recordedByUserId: currentUserId });

    // For now, assuming recordedByUserId is provided in the request body for simplicity,
    // or you'll need to pass 'req.user.id' from your `withMiddleware` if it handles authentication.
    if (!validatedData.recordedByUserId) { // Use recordedByUserId from validatedData
      return NextResponse.json({ error: 'User recording revenue is required.' }, { status: 400 });
    }

    const newRevenue = await RevenueService.create(validatedData);
    return NextResponse.json(newRevenue, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating revenue:', error);
    // Aligning error message format with `withMiddleware` expectation
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('exceeds 100%')) {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    // Changed 'message' to 'error'
    return NextResponse.json({ error: 'Failed to create revenue' }, { status: 500 });
  }
});
// src/app/api/budgets/route.ts
import { NextResponse } from 'next/server';
import { withMiddleware, AuthenticatedRequest, APIContext } from '@/lib/api-middleware';
import { BudgetService } from '@/lib/services/budget.service';
import { createBudgetSchema } from '@/lib/validations/budget.validation';

// GET all budgets with actuals
export const GET = withMiddleware<any>(async (req: AuthenticatedRequest, context: APIContext) => {
  const budgets = await BudgetService.findAll(req.user.id);
  return NextResponse.json(budgets);
});

// POST create a new budget
export const POST = withMiddleware<any>(async (req: AuthenticatedRequest, context: APIContext) => {
  const body = await req.json();
  const parsed = createBudgetSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || 'Validation failed' },
      { status: 400 }
    );
  }

  const budget = await BudgetService.create({
    ...parsed.data,
    userId: req.user.id,
  });

  return NextResponse.json(budget, { status: 201 });
});

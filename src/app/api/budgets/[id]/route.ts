// src/app/api/budgets/[id]/route.ts
import { NextResponse } from 'next/server';
import { withMiddleware, AuthenticatedRequest, APIContext } from '@/lib/api-middleware';
import { BudgetService } from '@/lib/services/budget.service';
import { updateBudgetSchema } from '@/lib/validations/budget.validation';

// GET single budget with actuals
export const GET = withMiddleware<any>(async (req: AuthenticatedRequest, context: APIContext) => {
  const { id } = await context.params;
  const budget = await BudgetService.findById(id, req.user.id);

  if (!budget) {
    return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
  }

  return NextResponse.json(budget);
});

// PUT update budget
export const PUT = withMiddleware<any>(async (req: AuthenticatedRequest, context: APIContext) => {
  const { id } = await context.params;
  const body = await req.json();
  const parsed = updateBudgetSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || 'Validation failed' },
      { status: 400 }
    );
  }

  const budget = await BudgetService.update(id, req.user.id, parsed.data);
  return NextResponse.json(budget);
});

// DELETE budget
export const DELETE = withMiddleware<any>(async (req: AuthenticatedRequest, context: APIContext) => {
  const { id } = await context.params;
  await BudgetService.delete(id, req.user.id);
  return NextResponse.json({ message: 'Budget deleted successfully' });
});

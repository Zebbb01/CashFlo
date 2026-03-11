// src/app/api/reports/route.ts
import { NextResponse } from 'next/server';
import { withMiddleware, AuthenticatedRequest, APIContext } from '@/lib/api-middleware';
import { ReportService } from '@/lib/services/report.service';

export const GET = withMiddleware<any>(async (req: AuthenticatedRequest, context: APIContext) => {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const startDateStr = searchParams.get('startDate');
  const endDateStr = searchParams.get('endDate');

  if (!type || !['pnl', 'cashflow', 'balancesheet'].includes(type)) {
    return NextResponse.json(
      { error: 'Invalid report type. Use: pnl, cashflow, or balancesheet' },
      { status: 400 }
    );
  }

  const userId = req.user.id;
  const startDate = startDateStr ? new Date(startDateStr) : undefined;
  const endDate = endDateStr ? new Date(endDateStr) : undefined;

  // Validate date format
  if (startDateStr && isNaN(startDate!.getTime())) {
    return NextResponse.json({ error: 'Invalid startDate format' }, { status: 400 });
  }
  if (endDateStr && isNaN(endDate!.getTime())) {
    return NextResponse.json({ error: 'Invalid endDate format' }, { status: 400 });
  }

  switch (type) {
    case 'pnl': {
      const report = await ReportService.getProfitAndLoss(userId, startDate, endDate);
      return NextResponse.json(report);
    }
    case 'cashflow': {
      const report = await ReportService.getCashFlow(userId, startDate, endDate);
      return NextResponse.json(report);
    }
    case 'balancesheet': {
      const report = await ReportService.getBalanceSheet(userId);
      return NextResponse.json(report);
    }
    default:
      return NextResponse.json({ error: 'Unknown report type' }, { status: 400 });
  }
});

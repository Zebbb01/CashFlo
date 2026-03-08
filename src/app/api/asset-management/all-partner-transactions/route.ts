// src/app/api/asset-management/all-partner-transactions/route.ts
import { withMiddleware } from '@/lib/api-middleware';
import { PartnershipService } from '@/lib/services';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export const GET = withMiddleware(async (req) => {
  const { searchParams } = new URL(req.url);
  const currentUserId = searchParams.get('currentUserId');

  if (!currentUserId) {
    return NextResponse.json({ error: 'currentUserId is required' }, { status: 400 });
  }

  try {
    // 1. Find all assets owned by the current user
    const ownedAssets = await prisma.assetManagement.findMany({
      where: { userId: currentUserId },
      select: { id: true } // We only need the asset IDs
    });

    if (ownedAssets.length === 0) {
      return NextResponse.json({ allPartnershipTransactions: [] });
    }

    const allTransactionsPromises = []; // Let TypeScript infer the type

    // 2. For each owned asset, find all its active partnerships
    for (const asset of ownedAssets) {
      const assetPartnerships = await prisma.assetPartnership.findMany({
        where: { assetId: asset.id, isActive: true },
        select: { userId: true } // We only need the partner's userId
      });

      // 3. For each partnership, fetch its detailed transactions
      for (const partnership of assetPartnerships) {
        // Call the service method to get transactions for this specific asset-partner pair
        allTransactionsPromises.push(
          PartnershipService.getPartnershipDetails(asset.id, partnership.userId)
        );
      }
    }

    const results = await Promise.all(allTransactionsPromises);

    // 4. Aggregate all `allPartnershipTransactions` from the results
    const aggregatedTransactions = results.flatMap(result =>
      result ? result.allPartnershipTransactions : []
    );

    // Deduplicate transactions (optional, but good practice if a transaction could somehow be linked multiple ways)
    // For now, given PartnershipTransaction's ID is derived from RevenueShare/CostAttribution ID, it should be unique.
    // However, if a single underlying Revenue/Cost could lead to multiple PartnershipTransactions,
    // you might need a more robust deduplication based on transaction.id + transaction.type or similar.
    // For now, let's just sort.
    aggregatedTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


    return NextResponse.json({ allPartnershipTransactions: aggregatedTransactions });

  } catch (error: unknown) {
    console.error('Error fetching all partner transactions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch all partner transactions';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
});
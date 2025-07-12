// src/app/api/revenues/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import { auth } from '@clerk/nextjs'; // Example: If using Clerk for auth

// GET all revenues (no change from previous suggested response)
export async function GET() {
  try {
    const revenues = await prisma.revenue.findMany({
      include: {
        bankAssetManagement: true,
        user: true,
        revenueShares: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      },
      orderBy: {
        date: 'desc',
      },
    });
    return NextResponse.json(revenues, { status: 200 });
  } catch (error) {
    console.error('Error fetching revenues:', error);
    return NextResponse.json({ message: 'Failed to fetch revenues' }, { status: 500 });
  }
}

// POST a new revenue (Enhanced for sharing logic)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { source, amount, date, description, bankAssetManagementId, recordedByUserId } = body; // Renamed userId to recordedByUserId for clarity

    // --- Authentication: Get the ID of the user recording the revenue ---
    // const { userId: currentUserId } = auth();
    // const recordedByUserId = currentUserId; // Use authenticated user if available
    // if (!recordedByUserId) {
    //   return NextResponse.json({ message: 'Unauthorized: User recording revenue is required.' }, { status: 401 });
    // }

    // --- Input Validation ---
    if (!source || amount === undefined) {
      return NextResponse.json({ message: 'Source and amount are required' }, { status: 400 });
    }
    if (typeof amount !== 'number' || amount < 0) {
      return NextResponse.json({ message: 'Amount must be a positive number' }, { status: 400 });
    }
    if (!bankAssetManagementId) {
      return NextResponse.json({ message: 'Revenue must be linked to a bank asset management.' }, { status: 400 });
    }

    // --- Relationship Validation ---
    const asset = await prisma.assetManagement.findUnique({ where: { id: bankAssetManagementId } });
    if (!asset) {
      return NextResponse.json({ message: 'Bank Asset Management not found.' }, { status: 404 });
    }

    // Validate the user recording the revenue
    if (recordedByUserId) {
      const userExists = await prisma.user.findUnique({ where: { id: recordedByUserId } });
      if (!userExists) {
        return NextResponse.json({ message: 'User recording revenue not found.' }, { status: 404 });
      }
    } else {
        // If no user explicitly provided or authenticated, we need a default strategy
        // e.g., assign to the primary owner of the asset, or a default 'system' user, or disallow.
        return NextResponse.json({ message: 'User recording revenue is required.' }, { status: 400 });
    }

    // --- Create Revenue Record and Revenue Shares in a Transaction ---
    const newRevenue = await prisma.$transaction(async (prisma) => {
      const createdRevenue = await prisma.revenue.create({
        data: {
          source,
          amount,
          date: date ? new Date(date) : undefined,
          description,
          bankAssetManagement: { connect: { id: bankAssetManagementId } },
          user: { connect: { id: recordedByUserId } }, // Link to the user who recorded it
        },
      });

      // Find all active partnerships for the associated asset
      const activePartnerships = await prisma.assetPartnership.findMany({
        where: {
          assetId: bankAssetManagementId,
          isActive: true,
        },
      });

      // --- Revenue Sharing Calculation Logic ---
      const revenueSharesData: Array<{ revenueId: string; assetId: string; userId: string; shareAmount: number; percentage: number }> = [];

      let totalPartnerPercentage = activePartnerships.reduce((sum, p) => sum + p.sharePercentage, 0);

      if (totalPartnerPercentage > 100.0001) { // Allow for minor floating point inaccuracies
          throw new Error('Total active partnership percentage exceeds 100% for this asset. Please correct partnerships before adding revenue.');
      }

      // Prioritize explicit partnerships. If total active partnerships don't sum to 100%,
      // distribute the remainder to the user who recorded the revenue (if they are also a partner or implicit owner).
      // Or, if no partnerships, assign 100% to the recorder.

      if (activePartnerships.length === 0) {
        // No active partners defined, so 100% goes to the user who recorded it
        revenueSharesData.push({
          revenueId: createdRevenue.id,
          assetId: bankAssetManagementId,
          userId: recordedByUserId,
          shareAmount: createdRevenue.amount,
          percentage: 100,
        });
      } else {
        // Distribute among active partners
        activePartnerships.forEach(p => {
          revenueSharesData.push({
            revenueId: createdRevenue.id,
            assetId: bankAssetManagementId,
            userId: p.userId,
            shareAmount: createdRevenue.amount * (p.sharePercentage / 100),
            percentage: p.sharePercentage,
          });
        });

        // Handle unallocated remainder if totalPartnerPercentage < 100
        if (totalPartnerPercentage < 99.9999) { // Using threshold for float comparison
            const unallocatedPercentage = 100 - totalPartnerPercentage;
            const unallocatedAmount = createdRevenue.amount * (unallocatedPercentage / 100);

            // Option 1: Attribute remainder to the user who recorded the revenue if they are one of the partners
            const recorderIsPartner = activePartnerships.some(p => p.userId === recordedByUserId);
            if (recorderIsPartner) {
                // Find existing share for recorder and add unallocated amount/percentage
                const recorderShareIndex = revenueSharesData.findIndex(rs => rs.userId === recordedByUserId);
                if (recorderShareIndex !== -1) {
                    revenueSharesData[recorderShareIndex].shareAmount += unallocatedAmount;
                    revenueSharesData[recorderShareIndex].percentage += unallocatedPercentage;
                }
            } else {
                // Option 2: Create a separate share for the recorder for the unallocated portion
                // or for a 'default owner' if one is defined for the asset.
                // For now, let's add it as a new share for the recorder if they are not already linked to an asset partnership
                const existingRecorderShare = revenueSharesData.find(rs => rs.userId === recordedByUserId);
                if (existingRecorderShare) {
                    existingRecorderShare.shareAmount += unallocatedAmount;
                    existingRecorderShare.percentage += unallocatedPercentage;
                } else {
                    revenueSharesData.push({
                        revenueId: createdRevenue.id,
                        assetId: bankAssetManagementId,
                        userId: recordedByUserId, // Fallback to recorder
                        shareAmount: unallocatedAmount,
                        percentage: unallocatedPercentage,
                    });
                }
            }
        }
      }

      if (revenueSharesData.length > 0) {
        await prisma.revenueShare.createMany({
          data: revenueSharesData,
        });
      }

      return createdRevenue;
    });

    // Fetch the newly created revenue with its shares for the response
    const revenueWithShares = await prisma.revenue.findUnique({
      where: { id: newRevenue.id },
      include: {
        bankAssetManagement: true,
        user: true, // This is the user who recorded it
        revenueShares: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    return NextResponse.json(revenueWithShares, { status: 201 });
  } catch (error: any) {
    console.error('Error creating revenue:', error);
    if (error.message.includes('exceeds 100%')) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to create revenue' }, { status: 500 });
  }
}
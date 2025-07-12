// src/app/api/costs/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import { auth } from '@clerk/nextjs'; // Example: If using Clerk for auth

// GET all costs (no change from previous suggested response)
export async function GET() {
  try {
    const costs = await prisma.cost.findMany({
      include: {
        bankAssetManagement: {
          include: {
            bank: true,
            company: true,
          },
        },
        user: true,
        costAttributions: {
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
    return NextResponse.json(costs, { status: 200 });
  } catch (error) {
    console.error('Error fetching costs:', error);
    return NextResponse.json({ message: 'Failed to fetch costs' }, { status: 500 });
  }
}

// POST a new cost (Enhanced for attribution logic)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, amount, date, description, bankAssetManagementId, incurredByUserId, attributedToUserIds } = body; // incurredByUserId for who performed the transaction, attributedToUserIds for specific attribution

    // --- Authentication: Get the ID of the user incurring the cost ---
    // const { userId: currentUserId } = auth();
    // const incurredByUserId = currentUserId; // Use authenticated user if available
    // if (!incurredByUserId) {
    //   return NextResponse.json({ message: 'Unauthorized: User incurring cost is required.' }, { status: 401 });
    // }

    // --- Input Validation ---
    if (!category || amount === undefined) {
      return NextResponse.json({ message: 'Category and amount are required' }, { status: 400 });
    }
    if (typeof amount !== 'number' || amount < 0) {
      return NextResponse.json({ message: 'Amount must be a positive number' }, { status: 400 });
    }
    if (!bankAssetManagementId) {
      return NextResponse.json({ message: 'Cost must be linked to a bank asset management.' }, { status: 400 });
    }

    // Validate the user who incurred the cost
    if (incurredByUserId) {
      const userExists = await prisma.user.findUnique({ where: { id: incurredByUserId } });
      if (!userExists) {
        return NextResponse.json({ message: 'User incurring cost not found.' }, { status: 404 });
      }
    } else {
        return NextResponse.json({ message: 'User incurring cost is required.' }, { status: 400 });
    }

    // Validate attributedToUserIds if provided, and ensure they are active partners
    let specificAttribution = false;
    let validAttributedUsers: string[] = [];
    if (attributedToUserIds && Array.isArray(attributedToUserIds) && attributedToUserIds.length > 0) {
        specificAttribution = true;
        const activePartners = await prisma.assetPartnership.findMany({
            where: {
                assetId: bankAssetManagementId,
                isActive: true,
                userId: { in: attributedToUserIds }
            },
            select: { userId: true }
        });
        validAttributedUsers = activePartners.map(p => p.userId);
        if (validAttributedUsers.length !== attributedToUserIds.length) {
            return NextResponse.json({ message: 'One or more specified attributed users are not active partners for this asset.' }, { status: 400 });
        }
    }

    // --- Create Cost Record and Cost Attributions in a Transaction ---
    const newCost = await prisma.$transaction(async (prisma) => {
      const createdCost = await prisma.cost.create({
        data: {
          category,
          amount,
          date: date ? new Date(date) : undefined,
          description,
          bankAssetManagement: { connect: { id: bankAssetManagementId } },
          user: { connect: { id: incurredByUserId } }, // Link to the user who incurred it
        },
      });

      const costAttributionsData: Array<{ costId: string; assetId: string; userId: string; attributedAmount: number; percentage: number }> = [];

      if (specificAttribution) {
        // Option 1: Manual attribution specified by the user
        // Frontend should provide explicit percentages or an equal split logic.
        // For simplicity, let's assume if attributedToUserIds is provided, it's an equal split among them.
        const numAttributedUsers = validAttributedUsers.length;
        if (numAttributedUsers === 0) {
            throw new Error('No valid users specified for cost attribution.'); // Should be caught by earlier validation
        }
        const perUserAmount = createdCost.amount / numAttributedUsers;
        const perUserPercentage = 100 / numAttributedUsers;

        validAttributedUsers.forEach(userId => {
            costAttributionsData.push({
                costId: createdCost.id,
                assetId: bankAssetManagementId,
                userId: userId,
                attributedAmount: perUserAmount,
                percentage: perUserPercentage,
            });
        });

      } else {
        // Option 2: Automatic attribution based on active partnerships (default)
        const activePartnerships = await prisma.assetPartnership.findMany({
            where: {
                assetId: bankAssetManagementId,
                isActive: true,
            },
        });

        let totalPartnerPercentage = activePartnerships.reduce((sum, p) => sum + p.sharePercentage, 0);

        if (totalPartnerPercentage > 100.0001) {
            throw new Error('Total active partnership percentage exceeds 100% for this asset. Please correct partnerships before adding cost.');
        }

        if (activePartnerships.length === 0) {
            // No active partners defined, so 100% goes to the user who incurred it
            costAttributionsData.push({
                costId: createdCost.id,
                assetId: bankAssetManagementId,
                userId: incurredByUserId,
                attributedAmount: createdCost.amount,
                percentage: 100,
            });
        } else {
            // Distribute among active partners based on their sharePercentage
            activePartnerships.forEach(p => {
                costAttributionsData.push({
                    costId: createdCost.id,
                    assetId: bankAssetManagementId,
                    userId: p.userId,
                    attributedAmount: createdCost.amount * (p.sharePercentage / 100),
                    percentage: p.sharePercentage,
                });
            });

            // Handle unallocated remainder if totalPartnerPercentage < 100
            if (totalPartnerPercentage < 99.9999) {
                const unallocatedPercentage = 100 - totalPartnerPercentage;
                const unallocatedAmount = createdCost.amount * (unallocatedPercentage / 100);

                // Attribute remainder to the user who incurred the cost if they are one of the partners or primary owner
                const incurrerIsPartner = activePartnerships.some(p => p.userId === incurredByUserId);
                if (incurrerIsPartner) {
                    const incurrerAttributionIndex = costAttributionsData.findIndex(ca => ca.userId === incurredByUserId);
                    if (incurrerAttributionIndex !== -1) {
                        costAttributionsData[incurrerAttributionIndex].attributedAmount += unallocatedAmount;
                        costAttributionsData[incurrerAttributionIndex].percentage += unallocatedPercentage;
                    }
                } else {
                    // Create a separate attribution for the incurrer for the unallocated portion
                    const existingIncurrerAttribution = costAttributionsData.find(ca => ca.userId === incurredByUserId);
                    if (existingIncurrerAttribution) {
                        existingIncurrerAttribution.attributedAmount += unallocatedAmount;
                        existingIncurrerAttribution.percentage += unallocatedPercentage;
                    } else {
                        costAttributionsData.push({
                            costId: createdCost.id,
                            assetId: bankAssetManagementId,
                            userId: incurredByUserId, // Fallback to incurrer
                            attributedAmount: unallocatedAmount,
                            percentage: unallocatedPercentage,
                        });
                    }
                }
            }
        }
      }

      if (costAttributionsData.length > 0) {
        await prisma.costAttribution.createMany({
          data: costAttributionsData,
        });
      }

      return createdCost;
    });

    // Fetch the newly created cost with its attributions for the response
    const costWithAttributions = await prisma.cost.findUnique({
      where: { id: newCost.id },
      include: {
        bankAssetManagement: {
          include: {
            bank: true,
            company: true,
          },
        },
        user: true, // This is the user who incurred it
        costAttributions: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    return NextResponse.json(costWithAttributions, { status: 201 });
  } catch (error: any) {
    console.error('Error creating cost:', error);
    if (error.message.includes('exceeds 100%') || error.message.includes('No valid users')) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to create cost' }, { status: 500 });
  }
}
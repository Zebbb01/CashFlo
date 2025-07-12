// src/app/api/banks/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all banks
export async function GET() {
    try {
        const banks = await prisma.bank.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                assets: {
                    include: { // Include revenuesForBank and costsForBank related to each asset
                        revenuesForBank: true, // Corrected relation name
                        costsForBank: true,    // Corrected relation name
                    },
                },
            },
        });

        // Calculate overallSavings for each bank
        const banksWithSavings = banks.map(bank => {
            let totalRevenue = 0;
            let totalCost = 0;

            // Revenues and Costs directly linked to assets associated with the bank
            bank.assets.forEach(asset => {
                // Use the corrected relation names for iteration
                asset.revenuesForBank.forEach(revenue => totalRevenue += revenue.amount);
                asset.costsForBank.forEach(cost => totalCost += cost.amount);
            });

            // UPDATED CALCULATION: overallSavings = totalRevenue - totalCost
            const overallSavings = totalRevenue - totalCost;
            return { ...bank, overallSavings }; // Return bank data with calculated savings
        });

        return NextResponse.json(banksWithSavings, { status: 200 });
    } catch (error) {
        console.error('Error fetching banks:', error);
        return NextResponse.json({ message: 'Failed to fetch banks' }, { status: 500 });
    }
}

// POST a new bank - No change needed for logic, overallSavings is not set directly
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ message: 'Bank name is required' }, { status: 400 });
        }

        const newBank = await prisma.bank.create({
            data: {
                name,
            },
        });
        return NextResponse.json(newBank, { status: 201 });
    } catch (error: any) {
        console.error('Error creating bank:', error);
        if (error.code === 'P2002') { // Prisma error code for unique constraint violation
            return NextResponse.json({ message: 'Bank with this name already exists' }, { status: 409 });
        }
        return NextResponse.json({ message: 'Failed to create bank' }, { status: 500 });
    }
}
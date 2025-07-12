// src/app/api/banks/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET a single bank by ID
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const bank = await prisma.bank.findUnique({
            where: { id },
            include: {
                assets: {
                    include: { // Include revenuesForBank and costsForBank related to the asset
                        revenuesForBank: true, // Corrected relation name
                        costsForBank: true,    // Corrected relation name
                    },
                },
            },
        });

        if (!bank) {
            return NextResponse.json({ message: 'Bank not found' }, { status: 404 });
        }

        // Calculate overallSavings
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

        // Return the bank data along with the calculated overallSavings
        return NextResponse.json({ ...bank, overallSavings }, { status: 200 });
    } catch (error) {
        console.error('Error fetching bank:', error);
        return NextResponse.json({ message: 'Failed to fetch bank' }, { status: 500 });
    }
}

// PUT (Full Update) a bank by ID - No change needed here, as overallSavings is derived
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await req.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ message: 'Bank name is required' }, { status: 400 });
        }

        const updatedBank = await prisma.bank.update({
            where: { id },
            data: {
                name,
            },
        });
        return NextResponse.json(updatedBank, { status: 200 });
    } catch (error: any) {
        console.error('Error updating bank:', error);
        if (error.code === 'P2025') { // Prisma error code for record not found
            return NextResponse.json({ message: 'Bank not found' }, { status: 404 });
        }
        if (error.code === 'P2002') { // Prisma error code for unique constraint violation
            return NextResponse.json({ message: 'Bank with this name already exists' }, { status: 409 });
        }
        return NextResponse.json({ message: 'Failed to update bank' }, { status: 500 });
    }
}

// DELETE (Hard Delete) a bank by ID - No change needed
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        await prisma.bank.delete({
            where: { id },
        });
        return NextResponse.json({ message: 'Bank deleted successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Error deleting bank:', error);
        if (error.code === 'P2025') { // Prisma error code for record not found
            return NextResponse.json({ message: 'Bank not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Failed to delete bank' }, { status: 500 });
    }
}
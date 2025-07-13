// prisma\seeder\BankSeeder.ts
import { PrismaClient } from '@prisma/client';

export class BankSeeder {
  static async seed(prisma: PrismaClient) {
    console.log('Start seeding Companies and Assets...');

    // --- Seed Companies ---
    const Bank1 = await prisma.bank.upsert({
      where: { id: 'CIMB' },
      update: {},
      create: {
        name: 'CIMB',
      },
    });

    const Bank2 = await prisma.bank.upsert({
      where: { id: 'Cebuana Lhuillier' },
      update: {},
      create: {
        name: 'Cebuana Lhuillier',
      },
    });
    
    const Bank3 = await prisma.bank.upsert({
      where: { id: 'UNO digital' },
      update: {},
      create: {
        name: 'UNO digital',
      },
    });

    console.log(`Created/updated Bank with id: ${Bank1.id}`);
    console.log(`Created/updated Bank with id: ${Bank2.id}`);
    console.log(`Created/updated Bank with id: ${Bank3.id}`);
  }
}

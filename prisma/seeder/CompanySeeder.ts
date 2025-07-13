// prisma\seeder\CompanySeeder.ts
import { PrismaClient } from '@prisma/client';

export class CompanySeeder {
  static async seed(prisma: PrismaClient) {
    console.log('Start seeding Companies and Assets...');

    // --- Seed Companies ---
    const company1 = await prisma.company.upsert({
      where: { id: 'Agright Tech.' },
      update: {},
      create: {
        name: 'Agright Tech.',
        description: 'A leading tech company specializing in agricultural solutions.',
      },
    });

    const company2 = await prisma.company.upsert({
      where: { id: 'DNSC Students' },
      update: {},
      create: {
        name: 'DNSC Students',
        description: 'Empowering students through innovative technology solutions.',
      },
    });
    
    const company3 = await prisma.company.upsert({
      where: { id: 'Savings' },
      update: {},
      create: {
        name: 'Savings',
        description: 'Helping users save money through innovative solutions.',
      },
    });

    const company4 = await prisma.company.upsert({
      where: { id: 'Other Savings' },
      update: {},
      create: {
        name: 'Other Savings',
        description: 'Helping users save money through innovative solutions.',
      },
    });

    

    console.log(`Created/updated company with id: ${company1.id}`);
    console.log(`Created/updated company with id: ${company2.id}`);
    console.log(`Created/updated company with id: ${company3.id}`);
    console.log(`Created/updated company with id: ${company4.id}`);
  }
}

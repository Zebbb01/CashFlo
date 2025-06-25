// prisma\seeder\CompanySeeder.ts
import { PrismaClient } from '@prisma/client';

export class CompanySeeder {
  static async seed(prisma: PrismaClient) {
    console.log('Start seeding Companies and Assets...');

    // --- Seed Companies ---
    const company1 = await prisma.company.upsert({
      where: { id: 'Tech Solutions Inc.' },
      update: {},
      create: {
        name: 'Tech Solutions Inc.',
        description: 'Leading provider of innovative tech solutions.',
      },
    });
    console.log(`Created/updated company with id: ${company1.id}`);

    const company2 = await prisma.company.upsert({
      where: { id: 'Global Innovators Ltd.' },
      update: {},
      create: {
        name: 'Global Innovators Ltd.',
        description: 'Pioneering advancements in sustainable technology.',
      },
    });
    console.log(`Created/updated company with id: ${company2.id}`);

    const company3 = await prisma.company.upsert({
      where: { id: 'Future Enterprises' },
      update: {},
      create: {
        name: 'Future Enterprises',
        description: 'Diversified holdings across various industries.',
      },
    });
    console.log(`Created/updated company with id: ${company3.id}`);

    // --- Seed AssetManagement for Tech Solutions Inc. ---
    await prisma.assetManagement.upsert({
      where: { id: 'asset-tech-1' }, // A predictable ID for upsert; in real apps, you might not hardcode IDs
      update: { assetName: 'Server Rack 001' },
      create: {
        id: 'asset-tech-1',
        companyId: company1.id,
        assetType: 'Hardware',
        assetName: 'Server Rack 001',
        assetValue: 50000.00,
      },
    });
    console.log(`Created/updated asset for ${company1.name}: Server Rack 001`);

    await prisma.assetManagement.upsert({
      where: { id: 'asset-tech-2' },
      update: { assetName: 'Workstation XYZ' },
      create: {
        id: 'asset-tech-2',
        companyId: company1.id,
        assetType: 'IT Equipment',
        assetName: 'Workstation XYZ',
        assetValue: 2500.00,
      },
    });
    console.log(`Created/updated asset for ${company1.name}: Workstation XYZ`);

    // --- Seed AssetManagement for Global Innovators Ltd. ---
    await prisma.assetManagement.upsert({
      where: { id: 'asset-global-1' },
      update: { assetName: 'Research Lab Unit 5' },
      create: {
        id: 'asset-global-1',
        companyId: company2.id,
        assetType: 'Laboratory Equipment',
        assetName: 'Research Lab Unit 5',
        assetValue: 150000.00,
      },
    });
    console.log(`Created/updated asset for ${company2.name}: Research Lab Unit 5`);

    await prisma.assetManagement.upsert({
      where: { id: 'asset-global-2' },
      update: { assetName: 'Solar Panel Array Alpha' },
      create: {
        id: 'asset-global-2',
        companyId: company2.id,
        assetType: 'Infrastructure',
        assetName: 'Solar Panel Array Alpha',
        assetValue: 75000.00,
      },
    });
    console.log(`Created/updated asset for ${company2.name}: Solar Panel Array Alpha`);

    // --- Seed AssetManagement for Future Enterprises (example of soft-deleted asset) ---
    await prisma.assetManagement.upsert({
      where: { id: 'asset-future-1' },
      update: { assetName: 'Old Server Room Fan' },
      create: {
        id: 'asset-future-1',
        companyId: company3.id,
        assetType: 'Maintenance',
        assetName: 'Old Server Room Fan',
        assetValue: 300.00,
        deletedAt: new Date(), // This asset is soft-deleted
      },
    });
    console.log(`Created/updated asset for ${company3.name}: Old Server Room Fan (soft-deleted)`);

    console.log('Seeding Companies and Assets finished.');
  }
}

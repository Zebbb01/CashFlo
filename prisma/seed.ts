// prisma\seed.ts
import { PrismaClient } from '@prisma/client';
import { CompanySeeder } from './seeder/CompanySeeder'; // Import the CompanySeeder class
import { BankSeeder } from './seeder/BankSeeder';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');
  await CompanySeeder.seed(prisma);
  await BankSeeder.seed(prisma);
  console.log('🌱 Seeding completed.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

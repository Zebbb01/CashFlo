// prisma\seed.ts
import { PrismaClient } from '@prisma/client';
import { CompanySeeder } from './seeder/CompanySeeder'; // Import the CompanySeeder class

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');
  await CompanySeeder.seed(prisma);
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

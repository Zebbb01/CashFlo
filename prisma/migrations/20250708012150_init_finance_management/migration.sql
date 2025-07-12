/*
  Warnings:

  - You are about to drop the column `overallSavings` on the `Bank` table. All the data in the column will be lost.
  - You are about to drop the column `bankId` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `assetId` on the `Cost` table. All the data in the column will be lost.
  - You are about to drop the column `assetId` on the `Revenue` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_bankId_fkey";

-- DropForeignKey
ALTER TABLE "Cost" DROP CONSTRAINT "Cost_assetId_fkey";

-- DropForeignKey
ALTER TABLE "Revenue" DROP CONSTRAINT "Revenue_assetId_fkey";

-- AlterTable
ALTER TABLE "AssetManagement" ALTER COLUMN "assetValue" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Bank" DROP COLUMN "overallSavings";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "bankId";

-- AlterTable
ALTER TABLE "Cost" DROP COLUMN "assetId",
ADD COLUMN     "assetManagementId" TEXT;

-- AlterTable
ALTER TABLE "Revenue" DROP COLUMN "assetId",
ADD COLUMN     "assetManagementId" TEXT;

-- AddForeignKey
ALTER TABLE "Revenue" ADD CONSTRAINT "Revenue_assetManagementId_fkey" FOREIGN KEY ("assetManagementId") REFERENCES "AssetManagement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cost" ADD CONSTRAINT "Cost_assetManagementId_fkey" FOREIGN KEY ("assetManagementId") REFERENCES "AssetManagement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `assetManagementId` on the `Cost` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Cost` table. All the data in the column will be lost.
  - You are about to drop the column `assetManagementId` on the `Revenue` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Revenue` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cost" DROP CONSTRAINT "Cost_assetManagementId_fkey";

-- DropForeignKey
ALTER TABLE "Cost" DROP CONSTRAINT "Cost_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Revenue" DROP CONSTRAINT "Revenue_assetManagementId_fkey";

-- DropForeignKey
ALTER TABLE "Revenue" DROP CONSTRAINT "Revenue_companyId_fkey";

-- AlterTable
ALTER TABLE "Cost" DROP COLUMN "assetManagementId",
DROP COLUMN "companyId",
ADD COLUMN     "bankAssetManagementId" TEXT;

-- AlterTable
ALTER TABLE "Revenue" DROP COLUMN "assetManagementId",
DROP COLUMN "companyId",
ADD COLUMN     "bankAssetManagementId" TEXT;

-- AddForeignKey
ALTER TABLE "Revenue" ADD CONSTRAINT "Revenue_bankAssetManagementId_fkey" FOREIGN KEY ("bankAssetManagementId") REFERENCES "AssetManagement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cost" ADD CONSTRAINT "Cost_bankAssetManagementId_fkey" FOREIGN KEY ("bankAssetManagementId") REFERENCES "AssetManagement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

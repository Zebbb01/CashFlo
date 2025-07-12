-- AlterTable
ALTER TABLE "AssetManagement" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "AssetManagement" ADD CONSTRAINT "AssetManagement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateTable
CREATE TABLE "AssetPartnership" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sharePercentage" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetPartnership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnershipInvitation" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "sharePercentage" DOUBLE PRECISION NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnershipInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevenueShare" (
    "id" TEXT NOT NULL,
    "revenueId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "shareAmount" DOUBLE PRECISION NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RevenueShare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostAttribution" (
    "id" TEXT NOT NULL,
    "costId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "attributedAmount" DOUBLE PRECISION NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CostAttribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AssetPartnership_assetId_idx" ON "AssetPartnership"("assetId");

-- CreateIndex
CREATE INDEX "AssetPartnership_userId_idx" ON "AssetPartnership"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AssetPartnership_assetId_userId_key" ON "AssetPartnership"("assetId", "userId");

-- CreateIndex
CREATE INDEX "PartnershipInvitation_receiverId_idx" ON "PartnershipInvitation"("receiverId");

-- CreateIndex
CREATE INDEX "PartnershipInvitation_senderId_idx" ON "PartnershipInvitation"("senderId");

-- CreateIndex
CREATE UNIQUE INDEX "PartnershipInvitation_assetId_receiverId_key" ON "PartnershipInvitation"("assetId", "receiverId");

-- CreateIndex
CREATE INDEX "RevenueShare_assetId_idx" ON "RevenueShare"("assetId");

-- CreateIndex
CREATE INDEX "RevenueShare_userId_idx" ON "RevenueShare"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RevenueShare_revenueId_userId_key" ON "RevenueShare"("revenueId", "userId");

-- CreateIndex
CREATE INDEX "CostAttribution_assetId_idx" ON "CostAttribution"("assetId");

-- CreateIndex
CREATE INDEX "CostAttribution_userId_idx" ON "CostAttribution"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CostAttribution_costId_userId_key" ON "CostAttribution"("costId", "userId");

-- AddForeignKey
ALTER TABLE "AssetPartnership" ADD CONSTRAINT "AssetPartnership_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "AssetManagement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetPartnership" ADD CONSTRAINT "AssetPartnership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnershipInvitation" ADD CONSTRAINT "PartnershipInvitation_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "AssetManagement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnershipInvitation" ADD CONSTRAINT "PartnershipInvitation_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnershipInvitation" ADD CONSTRAINT "PartnershipInvitation_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueShare" ADD CONSTRAINT "RevenueShare_revenueId_fkey" FOREIGN KEY ("revenueId") REFERENCES "Revenue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueShare" ADD CONSTRAINT "RevenueShare_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "AssetManagement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueShare" ADD CONSTRAINT "RevenueShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostAttribution" ADD CONSTRAINT "CostAttribution_costId_fkey" FOREIGN KEY ("costId") REFERENCES "Cost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostAttribution" ADD CONSTRAINT "CostAttribution_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "AssetManagement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostAttribution" ADD CONSTRAINT "CostAttribution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

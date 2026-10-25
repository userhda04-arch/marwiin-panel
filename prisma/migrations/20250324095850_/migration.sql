/*
  Warnings:

  - A unique constraint covering the columns `[HWID]` on the table `Blacklisted_Id` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Blacklisted_Id" ADD COLUMN     "bannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "licenseKey" TEXT,
ADD COLUMN     "reason" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Blacklisted_Id_HWID_key" ON "Blacklisted_Id"("HWID");

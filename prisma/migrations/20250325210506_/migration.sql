/*
  Warnings:

  - The primary key for the `Server_Infos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `licenseId` on the `Server_Infos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Server_Infos` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Server_Infos" DROP CONSTRAINT "Server_Infos_pkey",
DROP COLUMN "licenseId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT;
DROP SEQUENCE "Server_Infos_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Server_Infos_id_key" ON "Server_Infos"("id");

-- AddForeignKey
ALTER TABLE "Server_Infos" ADD CONSTRAINT "Server_Infos_id_fkey" FOREIGN KEY ("id") REFERENCES "License"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

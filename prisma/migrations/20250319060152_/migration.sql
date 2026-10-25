-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('SERVER_START', 'SERVER_STOP', 'SERVER_RENAME', 'SERVER_EXPIRED', 'SERVER_RENEW', 'SERVER_CREATE', 'MEMBER_ADD', 'MEMBER_REMOVE', 'MEMBER_UPDATE', 'CONFIG_UPDATE', 'IP_RESET', 'DOWNLOAD');

-- CreateTable
CREATE TABLE "Version" (
    "id" SERIAL NOT NULL,
    "version" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Server_Activity" (
    "id" SERIAL NOT NULL,
    "licenseId" TEXT NOT NULL DEFAULT '',
    "action" "ActivityType" NOT NULL,
    "details" TEXT,
    "performedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Server_Activity_pkey" PRIMARY KEY ("id")
);

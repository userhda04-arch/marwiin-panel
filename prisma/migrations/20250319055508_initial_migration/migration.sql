-- CreateTable
CREATE TABLE "License" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "serverIp" TEXT,
    "serverName" TEXT NOT NULL DEFAULT 'My New Server',
    "serverConfiguration" JSONB NOT NULL DEFAULT '{}',
    "serverExpiration" BIGINT NOT NULL,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "lastStartedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "licenseKey" TEXT NOT NULL,

    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Redeemable" (
    "id" SERIAL NOT NULL,
    "expirationType" TEXT NOT NULL,
    "generatedBy" TEXT NOT NULL,
    "licenseKey" TEXT NOT NULL,

    CONSTRAINT "Redeemable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Server_Member" (
    "id" SERIAL NOT NULL,
    "licenseId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isDeveloper" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Server_Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blacklisted_Id" (
    "id" SERIAL NOT NULL,
    "HWID" TEXT NOT NULL,

    CONSTRAINT "Blacklisted_Id_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "configuration" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "License_licenseKey_key" ON "License"("licenseKey");

-- CreateIndex
CREATE UNIQUE INDEX "Redeemable_licenseKey_key" ON "Redeemable"("licenseKey");

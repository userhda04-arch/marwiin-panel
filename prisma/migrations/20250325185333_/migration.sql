-- CreateTable
CREATE TABLE "Server_Infos" (
    "id" SERIAL NOT NULL,
    "licenseId" TEXT NOT NULL,
    "licenseKey" TEXT NOT NULL,
    "playerCount" INTEGER NOT NULL,
    "slots" INTEGER NOT NULL,
    "playerList" JSONB NOT NULL,
    "banCount" INTEGER NOT NULL,
    "banList" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Server_Infos_pkey" PRIMARY KEY ("id")
);

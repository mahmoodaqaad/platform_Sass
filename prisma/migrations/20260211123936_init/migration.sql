-- CreateTable
CREATE TABLE "GlobalSettings" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "platformName" TEXT NOT NULL DEFAULT 'Booking SaaS',
    "supportEmail" TEXT NOT NULL DEFAULT 'support@example.com',
    "supportPhone" TEXT,
    "registrationOpen" BOOLEAN NOT NULL DEFAULT true,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "commissionRate" DECIMAL(65,30) NOT NULL DEFAULT 10.0,
    "tiersConfig" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalSettings_pkey" PRIMARY KEY ("id")
);

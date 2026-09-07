-- CreateEnum
CREATE TYPE "MotorcycleStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD');

-- CreateEnum
CREATE TYPE "MotoTransactionType" AS ENUM ('RECEITA', 'DESPESA');

-- CreateTable
CREATE TABLE "Motorcycle" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "color" TEXT,
    "plate" TEXT,
    "mileage" INTEGER NOT NULL DEFAULT 0,
    "purchaseCostCents" INTEGER NOT NULL DEFAULT 0,
    "salePriceCents" INTEGER NOT NULL,
    "soldPriceCents" INTEGER,
    "status" "MotorcycleStatus" NOT NULL DEFAULT 'AVAILABLE',
    "description" TEXT,
    "imageData" TEXT,
    "soldAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Motorcycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MotoTransaction" (
    "id" TEXT NOT NULL,
    "type" "MotoTransactionType" NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motorcycleId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "MotoTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Motorcycle_status_idx" ON "Motorcycle"("status");

-- CreateIndex
CREATE INDEX "MotoTransaction_date_idx" ON "MotoTransaction"("date");

-- CreateIndex
CREATE INDEX "MotoTransaction_type_idx" ON "MotoTransaction"("type");

-- CreateIndex
CREATE INDEX "MotoTransaction_motorcycleId_idx" ON "MotoTransaction"("motorcycleId");

-- AddForeignKey
ALTER TABLE "MotoTransaction" ADD CONSTRAINT "MotoTransaction_motorcycleId_fkey" FOREIGN KEY ("motorcycleId") REFERENCES "Motorcycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MotoTransaction" ADD CONSTRAINT "MotoTransaction_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

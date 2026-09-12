-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category",
ADD COLUMN     "shelf" TEXT;

-- CreateTable
CREATE TABLE "Boleto" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDENTE',
    "paidAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "financialTransactionId" TEXT,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Boleto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Boleto_financialTransactionId_key" ON "Boleto"("financialTransactionId");

-- CreateIndex
CREATE INDEX "Boleto_dueDate_idx" ON "Boleto"("dueDate");

-- CreateIndex
CREATE INDEX "Boleto_status_idx" ON "Boleto"("status");

-- AddForeignKey
ALTER TABLE "Boleto" ADD CONSTRAINT "Boleto_financialTransactionId_fkey" FOREIGN KEY ("financialTransactionId") REFERENCES "FinancialTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boleto" ADD CONSTRAINT "Boleto_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

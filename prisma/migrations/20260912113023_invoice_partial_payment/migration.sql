-- AlterEnum
ALTER TYPE "InvoiceStatus" ADD VALUE 'PARTIAL';

-- AlterTable
ALTER TABLE "Boleto" ADD COLUMN     "invoiceId" TEXT;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "paidCents" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Boleto_invoiceId_idx" ON "Boleto"("invoiceId");

-- AddForeignKey
ALTER TABLE "Boleto" ADD CONSTRAINT "Boleto_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

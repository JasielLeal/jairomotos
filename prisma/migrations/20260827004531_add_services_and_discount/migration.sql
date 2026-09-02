-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "discountCents" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "InvoiceService" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "invoiceId" TEXT NOT NULL,

    CONSTRAINT "InvoiceService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InvoiceService_invoiceId_idx" ON "InvoiceService"("invoiceId");

-- AddForeignKey
ALTER TABLE "InvoiceService" ADD CONSTRAINT "InvoiceService_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

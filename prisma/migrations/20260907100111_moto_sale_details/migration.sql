-- Sale details captured when a motorcycle is marked as sold: who bought it,
-- and (possibly several) proof-of-sale photos instead of a single one.
ALTER TABLE "Motorcycle" DROP COLUMN "saleProofData";
ALTER TABLE "Motorcycle" ADD COLUMN "buyerName" TEXT;
ALTER TABLE "Motorcycle" ADD COLUMN "buyerPhone" TEXT;
ALTER TABLE "Motorcycle" ADD COLUMN "saleProofImages" TEXT[] NOT NULL DEFAULT '{}';

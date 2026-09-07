-- Product: replace single imageData with a multi-photo array (up to 5, enforced in app code)
ALTER TABLE "Product" ADD COLUMN "images" TEXT[] NOT NULL DEFAULT '{}';
UPDATE "Product" SET "images" = ARRAY["imageData"] WHERE "imageData" IS NOT NULL;
ALTER TABLE "Product" DROP COLUMN "imageData";

-- Motorcycle: replace single imageData with a multi-photo array, plus a dedicated
-- sale-proof photo captured when the motorcycle is marked as sold.
ALTER TABLE "Motorcycle" ADD COLUMN "images" TEXT[] NOT NULL DEFAULT '{}';
UPDATE "Motorcycle" SET "images" = ARRAY["imageData"] WHERE "imageData" IS NOT NULL;
ALTER TABLE "Motorcycle" DROP COLUMN "imageData";
ALTER TABLE "Motorcycle" ADD COLUMN "saleProofData" TEXT;

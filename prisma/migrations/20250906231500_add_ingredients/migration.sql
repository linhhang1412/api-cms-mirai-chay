-- Create enums for ingredients
CREATE TYPE "public"."BaseUom" AS ENUM ('G', 'KG', 'ML', 'L', 'PCS', 'BUNCH');
CREATE TYPE "public"."StorageType" AS ENUM ('AMBIENT', 'CHILL', 'FREEZE');

-- Create ingredients table
CREATE TABLE "public"."ingredients" (
    "id" SERIAL NOT NULL,
    "publicId" UUID NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "category" VARCHAR(100),
    "baseUom" "public"."BaseUom" NOT NULL,
    "storageType" "public"."StorageType",
    "shelfLifeDays" INTEGER,
    "barcode" VARCHAR(64),
    "status" "public"."Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "ingredients_publicId_key" ON "public"."ingredients"("publicId");
CREATE UNIQUE INDEX "uniq_ingredient_code" ON "public"."ingredients"("code");
CREATE INDEX "idx_ingredient_status" ON "public"."ingredients"("status");
CREATE INDEX "idx_ingredient_name" ON "public"."ingredients"("name");
CREATE INDEX "idx_ingredient_code_status" ON "public"."ingredients"("code", "status");


-- Create IngredientUnit table
CREATE TABLE "public"."ingredient_units" (
  "id" SERIAL NOT NULL,
  "code" VARCHAR(32) NOT NULL,
  "name" VARCHAR(120) NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ingredient_units_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "uniq_ingredient_unit_code" ON "public"."ingredient_units"("code");
CREATE INDEX "idx_ing_unit_active" ON "public"."ingredient_units"("active");
CREATE INDEX "idx_ing_unit_name" ON "public"."ingredient_units"("name");

-- Alter ingredients: add unitId, fk, drop old unit string
ALTER TABLE "public"."ingredients"
  ADD COLUMN IF NOT EXISTS "unitId" INTEGER;

ALTER TABLE "public"."ingredients"
  ADD CONSTRAINT IF NOT EXISTS "ingredients_unitId_fkey"
  FOREIGN KEY ("unitId") REFERENCES "public"."ingredient_units"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "public"."ingredients" DROP COLUMN IF EXISTS "unit";


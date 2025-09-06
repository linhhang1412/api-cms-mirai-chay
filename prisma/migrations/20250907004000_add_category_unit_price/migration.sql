-- Create IngredientCategory table
CREATE TABLE "public"."ingredient_categories" (
  "id" SERIAL NOT NULL,
  "code" VARCHAR(32) NOT NULL,
  "name" VARCHAR(120) NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ingredient_categories_pkey" PRIMARY KEY ("id")
);

-- Indexes for category
CREATE UNIQUE INDEX "uniq_ingredient_category_code" ON "public"."ingredient_categories"("code");
CREATE INDEX "idx_ing_cat_active" ON "public"."ingredient_categories"("active");
CREATE INDEX "idx_ing_cat_name" ON "public"."ingredient_categories"("name");

-- Alter ingredients: add categoryId, unit, referencePrice, drop old category string
ALTER TABLE "public"."ingredients"
  ADD COLUMN IF NOT EXISTS "categoryId" INTEGER,
  ADD COLUMN IF NOT EXISTS "unit" VARCHAR(32),
  ADD COLUMN IF NOT EXISTS "referencePrice" DECIMAL(12,2);

-- Add foreign key
ALTER TABLE "public"."ingredients"
  ADD CONSTRAINT IF NOT EXISTS "ingredients_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "public"."ingredient_categories"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Drop legacy category column
ALTER TABLE "public"."ingredients" DROP COLUMN IF EXISTS "category";


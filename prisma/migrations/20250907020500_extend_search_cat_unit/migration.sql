-- Ensure extensions exist (no-op if already created in earlier migration)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- FTS indexes for ingredient_categories and ingredient_units
CREATE INDEX IF NOT EXISTS idx_ing_cat_fts ON "public"."ingredient_categories"
USING GIN (to_tsvector('simple', unaccent(coalesce("code", '') || ' ' || coalesce("name", ''))));

CREATE INDEX IF NOT EXISTS idx_ing_unit_fts ON "public"."ingredient_units"
USING GIN (to_tsvector('simple', unaccent(coalesce("code", '') || ' ' || coalesce("name", ''))));

-- Trigram indexes on name/code for category & unit
CREATE INDEX IF NOT EXISTS idx_ing_cat_name_trgm ON "public"."ingredient_categories" USING GIN ("name" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_ing_cat_code_trgm ON "public"."ingredient_categories" USING GIN ("code" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_ing_unit_name_trgm ON "public"."ingredient_units" USING GIN ("name" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_ing_unit_code_trgm ON "public"."ingredient_units" USING GIN ("code" gin_trgm_ops);


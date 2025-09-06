-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Full-text search GIN index over code + name (unaccented)
CREATE INDEX IF NOT EXISTS idx_ingredients_fts ON "public"."ingredients"
USING GIN (to_tsvector('simple', unaccent(coalesce("code", '') || ' ' || coalesce("name", ''))));

-- Trigram indexes for fuzzy matching
CREATE INDEX IF NOT EXISTS idx_ingredients_name_trgm ON "public"."ingredients" USING GIN ("name" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_ingredients_code_trgm ON "public"."ingredients" USING GIN ("code" gin_trgm_ops);


-- Drop unused columns and enums from ingredients per refactor

-- Drop columns if exist
ALTER TABLE "public"."ingredients"
  DROP COLUMN IF EXISTS "baseUom",
  DROP COLUMN IF EXISTS "storageType",
  DROP COLUMN IF EXISTS "shelfLifeDays",
  DROP COLUMN IF EXISTS "barcode";

-- Drop enum types if no longer used
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BaseUom') THEN
    DROP TYPE "public"."BaseUom";
  END IF;
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'StorageType') THEN
    DROP TYPE "public"."StorageType";
  END IF;
END $$;


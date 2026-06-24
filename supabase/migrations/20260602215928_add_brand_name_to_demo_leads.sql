/*
  # Add brand_name column to demo_leads

  1. Changes
    - Add `brand_name` (text) column to `demo_leads` table with empty string default
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'demo_leads' AND column_name = 'brand_name'
  ) THEN
    ALTER TABLE demo_leads ADD COLUMN brand_name text NOT NULL DEFAULT '';
  END IF;
END $$;

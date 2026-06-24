/*
  # Create demo_leads table

  1. New Tables
    - `demo_leads`
      - `id` (uuid, primary key)
      - `name` (text) - contact person name
      - `brand_name` (text) - brand/company name
      - `contact` (text) - email or phone
      - `monthly_orders` (text) - estimated monthly orders
      - `source` (text) - how they found us
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `demo_leads` table
    - Add policy for service role to insert (used by edge function)
    - Add policy for service role to select
*/

CREATE TABLE IF NOT EXISTS demo_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  brand_name text NOT NULL DEFAULT '',
  contact text NOT NULL DEFAULT '',
  monthly_orders text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE demo_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert demo leads"
  ON demo_leads FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can select demo leads"
  ON demo_leads FOR SELECT
  TO service_role
  USING (true);

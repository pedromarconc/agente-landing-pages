/*
  # Create demo leads table

  ## Purpose
  Stores all leads who complete the demo request form on the Kanglu landing page.

  ## New Tables
  - `demo_leads`
    - `id` (uuid, primary key) - unique identifier
    - `name` (text) - full name of the lead
    - `contact` (text) - email or WhatsApp contact
    - `monthly_orders` (text) - monthly order volume range
    - `source` (text) - how they found Kanglu
    - `created_at` (timestamptz) - submission timestamp

  ## Security
  - RLS enabled on `demo_leads`
  - Public INSERT policy: anyone can submit the form
  - SELECT/UPDATE/DELETE restricted to authenticated users (team members)
*/

CREATE TABLE IF NOT EXISTS demo_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact text NOT NULL,
  monthly_orders text NOT NULL,
  source text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE demo_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a demo lead"
  ON demo_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read all leads"
  ON demo_leads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete leads"
  ON demo_leads
  FOR DELETE
  TO authenticated
  USING (true);

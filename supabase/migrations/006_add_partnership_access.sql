-- Partnership Portal Access Table
CREATE TABLE IF NOT EXISTS pq_partnership_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  access_code text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index on access_code for faster lookups
CREATE INDEX IF NOT EXISTS idx_partnership_access_code ON pq_partnership_access(access_code);

-- Enable RLS
ALTER TABLE pq_partnership_access ENABLE ROW LEVEL SECURITY;

-- Public read policy (anyone can verify a code exists without auth)
CREATE POLICY "partnership_access_public_read" ON pq_partnership_access
  FOR SELECT USING (true);

-- Seed partnership data
INSERT INTO pq_partnership_access (name, role, access_code) VALUES
  ('Alex', 'Founder', 'ALEX-2026'),
  ('Adam', 'Co-Founder', 'ADAM-2026'),
  ('Charlie', 'Partner', 'CHARLIE-2026'),
  ('Vinson & Elkins', 'Legal Counsel', 'VE-2026'),
  ('Houlihan Lokey', 'M&A Advisory', 'HL-2026')
ON CONFLICT (access_code) DO NOTHING;

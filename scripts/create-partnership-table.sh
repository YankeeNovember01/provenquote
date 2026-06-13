#!/bin/bash

# Load env vars
source .env.local

SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL"
SERVICE_KEY="$SUPABASE_SERVICE_ROLE_KEY"

echo "🚀 Creating Partnership Portal table..."

# Create the table and seed data in one SQL command
SQL="
CREATE TABLE IF NOT EXISTS public.pq_partnership_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  access_code text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partnership_access_code ON public.pq_partnership_access(access_code);

ALTER TABLE public.pq_partnership_access ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS partnership_access_public_read ON public.pq_partnership_access;
CREATE POLICY partnership_access_public_read ON public.pq_partnership_access FOR SELECT USING (true);

DELETE FROM public.pq_partnership_access WHERE access_code IN ('ALEX-2026', 'ADAM-2026', 'CHARLIE-2026', 'VE-2026', 'HL-2026');

INSERT INTO public.pq_partnership_access (name, role, access_code) VALUES
  ('Alex', 'Founder', 'ALEX-2026'),
  ('Adam', 'Co-Founder', 'ADAM-2026'),
  ('Charlie', 'Partner', 'CHARLIE-2026'),
  ('Vinson & Elkins', 'Legal Counsel', 'VE-2026'),
  ('Houlihan Lokey', 'M&A Advisory', 'HL-2026');
"

# Use the Supabase SQL Editor endpoint (requires manual execution)
# For now, document what needs to be done
echo ""
echo "📝 Please run this SQL in the Supabase dashboard (SQL Editor):"
echo "=========================================="
echo "$SQL"
echo "=========================================="
echo ""
echo "Or execute this curl command if you have jq installed:"
echo ""
echo "curl -X POST '$SUPABASE_URL/rest/v1/rpc/exec_sql' \\"
echo "  -H 'apikey: $SERVICE_KEY' \\"
echo "  -H 'Authorization: Bearer $SERVICE_KEY' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"query\": \"$(echo $SQL | jq -Rs .)\"}'"

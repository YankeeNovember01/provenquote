-- ProvenQuote.ai Initial Schema
-- Run via: npx tsx scripts/migrate.ts

-- Business accounts (linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS pq_businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  business_name text NOT NULL,
  slug text UNIQUE,
  niche text,
  phone text,
  email text,
  website text,
  city text,
  state text,
  description text,
  logo_url text,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text DEFAULT 'inactive',
  verified boolean DEFAULT false,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Market leases
CREATE TABLE IF NOT EXISTS pq_market_leases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES pq_businesses(id) ON DELETE CASCADE,
  niche text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  monthly_cost integer NOT NULL,
  status text DEFAULT 'active',
  stripe_subscription_id text,
  started_at timestamptz DEFAULT now(),
  next_billing_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Leads (submitted by homeowners on provenquote.com)
CREATE TABLE IF NOT EXISTS pq_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  niche text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip text,
  homeowner_name text NOT NULL,
  phone text,
  email text,
  service_type text,
  description text,
  urgency text DEFAULT 'Medium',
  estimated_budget text,
  has_insurance boolean DEFAULT false,
  adjuster_visited boolean DEFAULT false,
  source_hub text,
  lead_score integer DEFAULT 50,
  status text DEFAULT 'new',
  purchased_by uuid[],
  damage_cause text,
  wants_inspection boolean DEFAULT false,
  roof_age integer,
  roof_size_sqft integer,
  created_at timestamptz DEFAULT now()
);

-- Lead purchases (pay-per-lead)
CREATE TABLE IF NOT EXISTS pq_lead_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES pq_leads(id),
  business_id uuid REFERENCES pq_businesses(id),
  stripe_payment_intent_id text,
  amount integer NOT NULL,
  purchased_at timestamptz DEFAULT now()
);

-- Messages (cross-app homeowner <-> business)
CREATE TABLE IF NOT EXISTS pq_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES pq_leads(id),
  sender_type text NOT NULL CHECK (sender_type IN ('business', 'homeowner')),
  sender_id text NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE pq_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE pq_market_leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE pq_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE pq_lead_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE pq_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "businesses_own_row" ON pq_businesses;
DROP POLICY IF EXISTS "businesses_select_public" ON pq_businesses;
DROP POLICY IF EXISTS "leases_own_rows" ON pq_market_leases;
DROP POLICY IF EXISTS "leads_read_if_leased" ON pq_leads;
DROP POLICY IF EXISTS "lead_purchases_own" ON pq_lead_purchases;
DROP POLICY IF EXISTS "messages_own" ON pq_messages;

-- RLS Policies
CREATE POLICY "businesses_own_row" ON pq_businesses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "businesses_select_public" ON pq_businesses FOR SELECT USING (true);

CREATE POLICY "leases_own_rows" ON pq_market_leases FOR ALL USING (
  business_id IN (SELECT id FROM pq_businesses WHERE user_id = auth.uid())
);

CREATE POLICY "leads_read_if_leased" ON pq_leads FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM pq_market_leases ml
    JOIN pq_businesses b ON b.id = ml.business_id
    WHERE b.user_id = auth.uid()
    AND ml.niche = pq_leads.niche
    AND ml.city = pq_leads.city
    AND ml.state = pq_leads.state
    AND ml.status = 'active'
  )
  OR auth.uid() IN (
    SELECT b.user_id FROM pq_lead_purchases lp
    JOIN pq_businesses b ON b.id = lp.business_id
    WHERE lp.lead_id = pq_leads.id
  )
);

-- Allow service role to insert leads (from webhook / admin)
CREATE POLICY "lead_purchases_own" ON pq_lead_purchases FOR ALL USING (
  business_id IN (SELECT id FROM pq_businesses WHERE user_id = auth.uid())
);

CREATE POLICY "messages_own" ON pq_messages FOR ALL USING (
  lead_id IN (
    SELECT l.id FROM pq_leads l
    WHERE l.niche IN (
      SELECT ml.niche FROM pq_market_leases ml
      JOIN pq_businesses b ON b.id = ml.business_id
      WHERE b.user_id = auth.uid()
    )
  )
  OR lead_id IN (
    SELECT lp.lead_id FROM pq_lead_purchases lp
    JOIN pq_businesses b ON b.id = lp.business_id
    WHERE b.user_id = auth.uid()
  )
);

-- Seed data: 6 leads for Roofing in Austin, TX
INSERT INTO pq_leads (niche, city, state, zip, homeowner_name, phone, email, service_type, description, urgency, estimated_budget, has_insurance, adjuster_visited, source_hub, lead_score, status, purchased_by, damage_cause, wants_inspection, roof_age, roof_size_sqft)
VALUES
  ('Roofing', 'Austin', 'TX', '78701', 'James Carter', '(512) 555-0198', 'jcarter@email.com', 'Full Roof Replacement', 'Major hail storm hit last week. Insurance adjuster already visited and confirmed coverage. Need full replacement ASAP before more rain.', 'Critical', '$15,000–$22,000', true, true, 'Roofing — Austin, TX', 98, 'new', '{}', 'Hail', false, 14, 2400),
  ('Roofing', 'Austin', 'TX', '78745', 'Maria Santos', '(512) 555-0134', 'msantos@gmail.com', 'Hail Damage Repair', 'Storm damage to several shingles, possible leak forming. Want inspection and estimate. Insurance not yet filed.', 'High', '$3,000–$8,000', true, false, 'Roofing — Austin, TX', 82, 'new', '{}', 'Hail', true, 8, 1800),
  ('Roofing', 'Austin', 'TX', '78758', 'Derek Williams', '(512) 555-0276', 'derek.w@email.com', 'Roof Repair', 'Noticed a leak in my master bedroom after the last rain. Not sure of the extent. Looking for inspection and repair quote.', 'Medium', '$1,500–$5,000', false, false, 'Roofing — Austin, TX', 65, 'new', '{}', 'Wear & Tear', true, 18, 2100),
  ('Roofing', 'Austin', 'TX', '78704', 'Linda Park', '(512) 555-0091', 'linda.park@gmail.com', 'Free Inspection', 'Just bought the home and want a full inspection. No known issues but the roof is getting old.', 'Low', 'Unknown', false, false, 'Roofing — Austin, TX', 41, 'new', '{}', 'None known', true, 12, 1600),
  ('Roofing', 'Austin', 'TX', '78748', 'Tom Bradley', '(512) 555-0183', 'tombradley@gmail.com', 'Full Roof Replacement', 'Insurance approved my claim after the May storm. Adjuster gave me $18,500. Looking for bids to get work done by end of month.', 'High', '$17,000–$21,000', true, true, 'Roofing — Austin, TX', 94, 'new', '{}', 'Wind', false, 20, 2800),
  ('HVAC', 'Phoenix', 'AZ', '85001', 'Sarah Johnson', '(602) 555-0142', 'sjohnson@email.com', 'AC Replacement', 'My AC unit is 15 years old and failing. Need full replacement before summer. Have quotes already from one company.', 'High', '$4,000–$8,000', false, false, 'HVAC — Phoenix, AZ', 78, 'new', '{}', 'Age/Wear', false, null, null)
ON CONFLICT DO NOTHING;

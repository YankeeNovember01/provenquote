-- Fix: Add tenant_id column to pq_leads for lease assignment
ALTER TABLE pq_leads ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES pq_businesses(id) ON DELETE SET NULL;
ALTER TABLE pq_leads ADD COLUMN IF NOT EXISTS assigned_at timestamptz;
ALTER TABLE pq_leads ADD COLUMN IF NOT EXISTS notified_at timestamptz;
ALTER TABLE pq_leads ADD COLUMN IF NOT EXISTS is_exclusive boolean DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_pq_leads_tenant_id ON pq_leads(tenant_id) WHERE tenant_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pq_leads_niche_city_state ON pq_leads(niche, city, state, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pq_leads_status ON pq_leads(status, created_at DESC);

-- RLS: businesses see only their assigned leads OR unassigned leads
DROP POLICY IF EXISTS "businesses_see_own_leads" ON pq_leads;
DROP POLICY IF EXISTS "businesses_see_available_leads" ON pq_leads;

CREATE POLICY "businesses_see_own_leads" ON pq_leads
  FOR SELECT
  USING (tenant_id IN (SELECT id FROM pq_businesses WHERE user_id = auth.uid()));

CREATE POLICY "businesses_see_available_leads" ON pq_leads
  FOR SELECT
  USING (tenant_id IS NULL AND status != 'spam');

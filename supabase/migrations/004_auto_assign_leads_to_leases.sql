-- Function: auto-assign new leads to businesses with active leases
CREATE OR REPLACE FUNCTION auto_assign_lead_to_lease()
RETURNS TRIGGER AS $$
DECLARE
  active_business_id uuid;
BEGIN
  -- Find active lease for this lead's niche + city + state
  SELECT ml.business_id INTO active_business_id
  FROM pq_market_leases ml
  WHERE ml.niche = NEW.niche
    AND lower(ml.city) = lower(NEW.city)
    AND lower(ml.state) = lower(NEW.state)
    AND ml.status = 'active'
  LIMIT 1;

  -- If found, assign the lead
  IF active_business_id IS NOT NULL THEN
    NEW.tenant_id := active_business_id;
    NEW.is_exclusive := true;
    NEW.assigned_at := now();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: fires BEFORE INSERT on pq_leads
DROP TRIGGER IF EXISTS trg_auto_assign_lead ON pq_leads;
CREATE TRIGGER trg_auto_assign_lead
  BEFORE INSERT ON pq_leads
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_lead_to_lease();

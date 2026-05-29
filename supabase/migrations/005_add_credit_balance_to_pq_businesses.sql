-- Add credit balance columns to pq_businesses
ALTER TABLE pq_businesses
  ADD COLUMN IF NOT EXISTS credit_balance integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS bonus_credit_balance integer NOT NULL DEFAULT 0;

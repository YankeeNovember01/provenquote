-- Migration: Add insurance_company and damage_year columns to pq_leads
-- These fields come from the .com qualification form but were missing from the original schema.

ALTER TABLE pq_leads
  ADD COLUMN IF NOT EXISTS insurance_company text,
  ADD COLUMN IF NOT EXISTS damage_year integer;

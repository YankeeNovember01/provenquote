import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local manually
const envPath = resolve(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    process.env[key.trim()] = valueParts.join('=').trim();
  }
});

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SERVICE_ROLE_KEY');
  console.error('SUPABASE_URL:', SUPABASE_URL);
  console.error('SERVICE_ROLE_KEY:', SERVICE_ROLE_KEY ? 'Present' : 'Missing');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function setupPartnership() {
  console.log('🚀 Setting up Partnership Portal table and seeding data...');
  
  try {
    // Create table
    const { error: createError } = await supabase.rpc('exec_sql', { 
      query: `
        CREATE TABLE IF NOT EXISTS pq_partnership_access (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          name text NOT NULL,
          role text NOT NULL,
          access_code text NOT NULL UNIQUE,
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        );
        
        CREATE INDEX IF NOT EXISTS idx_partnership_access_code ON pq_partnership_access(access_code);
        
        ALTER TABLE pq_partnership_access ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "partnership_access_public_read" ON pq_partnership_access
          FOR SELECT USING (true);
      `
    });

    if (createError) {
      console.log('⚠️  RPC exec_sql not available, attempting direct inserts instead');
      
      // Try direct insert with Supabase client
      const { error: insertError } = await supabase.from('pq_partnership_access').insert([
        { name: 'Alex', role: 'Founder', access_code: 'ALEX-2026' },
        { name: 'Adam', role: 'Co-Founder', access_code: 'ADAM-2026' },
        { name: 'Charlie', role: 'Partner', access_code: 'CHARLIE-2026' },
        { name: 'Vinson & Elkins', role: 'Legal Counsel', access_code: 'VE-2026' },
        { name: 'Houlihan Lokey', role: 'M&A Advisory', access_code: 'HL-2026' },
      ]);

      if (insertError && insertError.code !== '42P07') { // 42P07 = relation already exists
        console.log('❌ Insert error:', insertError);
      } else {
        console.log('✅ Partnership data seeded successfully');
      }
    } else {
      console.log('✅ Table created and seeded via RPC');
    }
  } catch (e) {
    console.error('❌ Error:', e);
  }
}

setupPartnership().catch(console.error);

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local
const envPath = resolve(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    process.env[key.trim()] = valueParts.join('=').trim();
  }
});

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing env vars');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function init() {
  console.log('🚀 Initializing Partnership Portal...\n');

  try {
    // First, try to create the table
    console.log('📊 Creating pq_partnership_access table...');
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.pq_partnership_access (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name text NOT NULL,
        role text NOT NULL,
        access_code text NOT NULL UNIQUE,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      );
    `;

    const { error: tableError } = await supabase
      .from('pq_partnership_access')
      .select('id')
      .limit(1);

    if (tableError?.code === 'PGRST116') {
      // Table doesn't exist, try to create via raw SQL
      console.log('   Table does not exist, attempting to create...');
      // Unfortunately we can't run raw SQL through the standard client
      // We'll document this step and proceed with the next part
    } else {
      console.log('   ✅ Table already exists or is accessible');
    }

    // Now seed the data
    console.log('\n🌱 Seeding partnership data...');
    
    const partners = [
      { name: 'Alex', role: 'Founder', access_code: 'ALEX-2026' },
      { name: 'Adam', role: 'Co-Founder', access_code: 'ADAM-2026' },
      { name: 'Charlie', role: 'Partner', access_code: 'CHARLIE-2026' },
      { name: 'Vinson & Elkins', role: 'Legal Counsel', access_code: 'VE-2026' },
      { name: 'Houlihan Lokey', role: 'M&A Advisory', access_code: 'HL-2026' },
    ];

    // Try upsert approach
    for (const partner of partners) {
      const { error } = await supabase
        .from('pq_partnership_access')
        .upsert(partner, { onConflict: 'access_code' });
      
      if (error) {
        console.log(`   ⚠️  Could not upsert ${partner.name}:`, error.message);
      } else {
        console.log(`   ✅ Seeded: ${partner.name} (${partner.access_code})`);
      }
    }

    console.log('\n✨ Partnership Portal setup complete!');
    console.log('\n📝 NOTE: If the table creation failed, create it manually in Supabase SQL editor:');
    console.log(createTableSQL);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

init();

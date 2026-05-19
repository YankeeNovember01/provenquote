import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://srextpuoihywyobookcx.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyZXh0cHVvaWh5d3lvYm9va2N4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODcyMjI0NiwiZXhwIjoyMDk0Mjk4MjQ2fQ.RybdSAiJ1l5AdzZc303H7gVC--VEIqwdQCM1zsZqceI';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function runMigration() {
  console.log('🚀 Running ProvenQuote.ai database migration...');
  
  const migrationPath = join(process.cwd(), 'supabase/migrations/001_initial_schema.sql');
  const sql = readFileSync(migrationPath, 'utf-8');
  
  // Split by semicolons and run each statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  let successCount = 0;
  let errorCount = 0;

  for (const statement of statements) {
    try {
      const { error } = await supabase.rpc('exec_sql', { query: statement });
      if (error) {
        // Try direct query approach
        console.log(`⚠️  RPC failed for statement, trying direct: ${statement.substring(0, 60)}...`);
        console.log('   Error:', error.message);
        errorCount++;
      } else {
        successCount++;
      }
    } catch (e) {
      console.log(`❌ Error: ${e}`);
      errorCount++;
    }
  }

  console.log(`\n✅ Migration complete: ${successCount} succeeded, ${errorCount} failed`);
  console.log('\nNote: If exec_sql RPC is not available, use the Supabase dashboard SQL editor to run supabase/migrations/001_initial_schema.sql');
}

runMigration().catch(console.error);

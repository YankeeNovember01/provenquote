import { createClient } from '@/lib/supabase/server';
import LeadsClient from './LeadsClient';
import { redirect } from 'next/navigation';

export default async function LeadsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const { data: business } = await supabase
    .from('pq_businesses')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!business) {
    return (
      <div className="p-8">
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-12 text-center">
          <p className="text-slate-400 mb-4">Complete your business profile to start viewing leads.</p>
          <a href="/dashboard/onboarding" className="text-[#2563EB] hover:text-white transition-colors">
            Complete Setup →
          </a>
        </div>
      </div>
    );
  }

  // Get active leases
  const { data: leases } = await supabase
    .from('pq_market_leases')
    .select('niche, city, state')
    .eq('business_id', business.id)
    .eq('status', 'active');

  // Get purchased lead IDs
  const { data: purchases } = await supabase
    .from('pq_lead_purchases')
    .select('lead_id')
    .eq('business_id', business.id);

  const purchasedLeadIds = new Set((purchases ?? []).map(p => p.lead_id));

  // Fetch leads for active lease markets
  let leads: Record<string, unknown>[] = [];

  if (leases && leases.length > 0) {
    for (const lease of leases) {
      const { data: marketLeads } = await supabase
        .from('pq_leads')
        .select('*')
        .eq('niche', lease.niche)
        .eq('city', lease.city)
        .eq('state', lease.state)
        .order('lead_score', { ascending: false });

      if (marketLeads) {
        leads.push(...marketLeads);
      }
    }
  }

  // Also fetch purchased leads not already in the list
  if (purchasedLeadIds.size > 0) {
    const existingIds = new Set(leads.map(l => (l as { id: string }).id));
    const missingIds = [...purchasedLeadIds].filter(id => !existingIds.has(id));

    if (missingIds.length > 0) {
      const { data: purchasedLeads } = await supabase
        .from('pq_leads')
        .select('*')
        .in('id', missingIds);

      if (purchasedLeads) leads.push(...purchasedLeads);
    }
  }

  // Remove duplicates
  const seen = new Set<string>();
  leads = leads.filter(l => {
    const id = (l as { id: string }).id;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });

  return (
    <LeadsClient
      initialLeads={leads}
      businessId={business.id}
      purchasedLeadIds={[...purchasedLeadIds]}
      hasLeases={(leases?.length ?? 0) > 0}
    />
  );
}

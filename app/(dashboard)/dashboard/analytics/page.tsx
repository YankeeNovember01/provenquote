import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AnalyticsClient from './AnalyticsClient';

export default async function AnalyticsPage() {
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
        <h1 className="text-2xl font-bold text-white mb-4">Analytics</h1>
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-12 text-center">
          <p className="text-slate-400">Set up your profile to see analytics.</p>
        </div>
      </div>
    );
  }

  // Get active leases
  const { data: leases } = await supabase
    .from('pq_market_leases')
    .select('*')
    .eq('business_id', business.id);

  // Get lead purchases
  const { data: purchases } = await supabase
    .from('pq_lead_purchases')
    .select('*')
    .eq('business_id', business.id);

  // Fetch leads for each active lease market (last 30 days) — only THIS business's leads
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  interface LeadRow {
    id: string;
    created_at: string;
    status: string;
    niche: string;
    city: string;
    state: string;
  }

  let allLeads: LeadRow[] = [];

  // Get leads assigned via market lease (tenant_id = my business)
  const { data: leasedLeads } = await supabase
    .from('pq_leads')
    .select('id, created_at, status, niche, city, state')
    .eq('tenant_id', business.id)
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: true });
  if (leasedLeads) allLeads.push(...leasedLeads);

  // Get individually purchased leads
  const purchasedLeadIds = (purchases ?? []).map((p: { lead_id: string }) => p.lead_id);
  if (purchasedLeadIds.length > 0) {
    const { data: purchasedLeads } = await supabase
      .from('pq_leads')
      .select('id, created_at, status, niche, city, state')
      .in('id', purchasedLeadIds)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });
    if (purchasedLeads) allLeads.push(...purchasedLeads);
  }

  // Dedupe
  const seen = new Set<string>();
  allLeads = allLeads.filter(l => {
    if (seen.has(l.id)) return false;
    seen.add(l.id);
    return true;
  });

  // Build daily chart data (last 30 days)
  const dailyData: { day: string; leads: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dayStart = new Date(d);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(d);
    dayEnd.setHours(23, 59, 59, 999);

    const count = allLeads.filter(l => {
      const ld = new Date(l.created_at);
      return ld >= dayStart && ld <= dayEnd;
    }).length;

    dailyData.push({ day: dayStr, leads: count });
  }

  // Status breakdown
  const statusCounts = allLeads.reduce<Record<string, number>>((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});

  // Summary stats
  const totalLeads = allLeads.length;
  const totalPurchases = (purchases ?? []).length;
  const totalSpend = (purchases ?? []).reduce((sum, p) => sum + (p.amount || 0), 0);
  const wonLeads = statusCounts['won'] || 0;
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

  return (
    <AnalyticsClient
      dailyData={dailyData}
      statusCounts={statusCounts}
      totalLeads={totalLeads}
      totalPurchases={totalPurchases}
      totalSpend={totalSpend}
      conversionRate={conversionRate}
      activeLeases={leases ?? []}
    />
  );
}

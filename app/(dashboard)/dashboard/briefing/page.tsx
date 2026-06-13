import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import BriefingClient from './BriefingClient';

export default async function BriefingPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const { data: business } = await supabase
    .from('pq_businesses')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!business || !business.onboarding_completed) {
    redirect('/dashboard/onboarding');
  }

  // Get active leases
  const { data: leases } = await supabase
    .from('pq_market_leases')
    .select('*')
    .eq('business_id', business.id)
    .eq('status', 'active');

  // Get leads from leased markets
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let leads: any[] = [];
  if (leases && leases.length > 0) {
    for (const lease of leases) {
      const { data: leaseLeads } = await supabase
        .from('pq_leads')
        .select('*')
        .eq('niche', lease.niche)
        .eq('city', lease.city)
        .eq('state', lease.state)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });
      if (leaseLeads) leads = [...leads, ...leaseLeads];
    }
  }

  // Calculate KPIs
  const activeLeads = leads.filter(l => l.status === 'new' || l.status === 'contacted');
  const booked = leads.filter(l => l.status === 'booked').length;
  const closed = leads.filter(l => l.status === 'closed').length;
  const totalLeads = leads.length;
  const conversionRate = totalLeads > 0 ? Math.round((closed / totalLeads) * 100) : 0;
  
  // Revenue estimation (rough)
  const avgDealSize = 5000; // placeholder
  const weeklyRevenue = closed * avgDealSize / 4;
  
  // Get market performance data
  const marketPerformance = leases?.map(lease => {
    const leaseLeads = leads.filter(l => l.niche === lease.niche && l.city === lease.city && l.state === lease.state);
    const leaseBooked = leaseLeads.filter(l => l.status === 'booked').length;
    const leaseClosed = leaseLeads.filter(l => l.status === 'closed').length;
    return {
      market: `${lease.city}, ${lease.state}`,
      niche: lease.niche,
      leads: leaseLeads.length,
      booked: leaseBooked,
      closed: leaseClosed,
      conversionRate: leaseLeads.length > 0 ? Math.round((leaseClosed / leaseLeads.length) * 100) : 0,
      cost: lease.monthly_cost,
      roi: leaseClosed > 0 ? Math.round(((leaseClosed * avgDealSize) / (lease.monthly_cost || 1)) * 100) : 0,
    };
  }) || [];

  return (
    <BriefingClient
      business={business}
      activeLeads={activeLeads.length}
      booked={booked}
      closed={closed}
      totalLeads={totalLeads}
      conversionRate={conversionRate}
      weeklyRevenue={weeklyRevenue}
      marketPerformance={marketPerformance}
      leases={leases || []}
      allLeads={leads}
    />
  );
}

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardHomeClient from './DashboardHomeClient';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const { data: business } = await supabase
    .from('pq_businesses')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Redirect to onboarding if not set up
  if (!business || !business.onboarding_completed) {
    redirect('/dashboard/onboarding');
  }

  // Get active leases
  const { data: leases } = await supabase
    .from('pq_market_leases')
    .select('*')
    .eq('business_id', business.id)
    .eq('status', 'active');

  // Get leads from leased markets (last 30 days)
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

  const newLeads = leads.filter(l => l.status === 'new');
  const monthlySpend = (leases ?? []).reduce((sum: number, l: any) => sum + (l.monthly_cost ?? 0), 0);
  const isPro = business.subscription_status === 'active' || business.subscription_status === 'trialing';

  return (
    <DashboardHomeClient
      business={business}
      leases={leases ?? []}
      leads={leads}
      newLeads={newLeads}
      monthlySpend={monthlySpend}
      isPro={isPro}
    />
  );
}

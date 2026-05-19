import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import MessagesClient from './MessagesClient';

export default async function MessagesPage() {
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
        <h1 className="text-2xl font-bold text-white mb-4">Messages</h1>
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-12 text-center">
          <p className="text-slate-400">Complete your profile to access messages.</p>
        </div>
      </div>
    );
  }

  // Get all leads for this business (via leases or purchases)
  const { data: leases } = await supabase
    .from('pq_market_leases')
    .select('niche, city, state')
    .eq('business_id', business.id)
    .eq('status', 'active');

  const { data: purchases } = await supabase
    .from('pq_lead_purchases')
    .select('lead_id')
    .eq('business_id', business.id);

  // Collect lead IDs
  let leadIds: string[] = (purchases ?? []).map(p => p.lead_id);

  // Get leads from active leases
  let leaseLeads: { id: string; homeowner_name: string; service_type: string; city: string; state: string }[] = [];
  if (leases && leases.length > 0) {
    for (const lease of leases) {
      const { data: mLeads } = await supabase
        .from('pq_leads')
        .select('id, homeowner_name, service_type, city, state')
        .eq('niche', lease.niche)
        .eq('city', lease.city)
        .eq('state', lease.state);
      if (mLeads) leaseLeads.push(...mLeads);
    }
  }

  // Combine and dedupe
  const allLeadIds = new Set([...leadIds, ...leaseLeads.map(l => l.id)]);

  // Fetch messages grouped by lead
  interface ConversationLead {
    id: string;
    homeowner_name: string;
    service_type: string;
    city: string;
    state: string;
  }

  const conversations: Array<{
    lead: ConversationLead;
    messages: Array<{ id: string; content: string; sender_type: string; created_at: string; read: boolean }>;
    unread: number;
  }> = [];

  for (const leadId of allLeadIds) {
    const { data: messages } = await supabase
      .from('pq_messages')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })
      .limit(50);

    const lead = leaseLeads.find(l => l.id === leadId);

    if (!lead) {
      // Try to fetch lead info
      const { data: leadData } = await supabase
        .from('pq_leads')
        .select('id, homeowner_name, service_type, city, state')
        .eq('id', leadId)
        .single();
      if (leadData) {
        conversations.push({
          lead: leadData,
          messages: messages ?? [],
          unread: (messages ?? []).filter(m => !m.read && m.sender_type === 'homeowner').length,
        });
      }
    } else {
      conversations.push({
        lead,
        messages: messages ?? [],
        unread: (messages ?? []).filter(m => !m.read && m.sender_type === 'homeowner').length,
      });
    }
  }

  return (
    <MessagesClient
      conversations={conversations}
      businessId={business.id}
    />
  );
}

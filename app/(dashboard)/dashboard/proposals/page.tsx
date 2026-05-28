'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Proposal {
  id: string;
  lead_id: string;
  message: string;
  status: 'sent' | 'viewed' | 'accepted' | 'declined';
  proposed_price: number | null;
  created_at: string;
  lead?: {
    homeowner_name: string;
    city: string;
    state: string;
    service_type: string;
    description: string;
    estimated_budget: string | null;
    urgency: string | null;
  };
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'sent' | 'accepted' | 'declined'>('all');

  useEffect(() => {
    async function fetchProposals() {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // Get this user's business
      const { data: business } = await supabase
        .from('pq_businesses')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!business) { setLoading(false); return; }

      const { data, error } = await supabase
        .from('pq_proposals')
        .select(`
          id,
          lead_id,
          message,
          status,
          proposed_price,
          created_at,
          lead:pq_leads(
            homeowner_name,
            city,
            state,
            service_type,
            description,
            estimated_budget,
            urgency
          )
        `)
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProposals(data as unknown as Proposal[]);
      }
      setLoading(false);
    }

    fetchProposals();
  }, []);

  const filtered = proposals.filter(p => {
    if (filter === 'sent') return p.status === 'sent' || p.status === 'viewed';
    if (filter === 'accepted') return p.status === 'accepted';
    if (filter === 'declined') return p.status === 'declined';
    return true;
  });

  const pendingCount = proposals.filter(p => p.status === 'sent' || p.status === 'viewed').length;

  const statusStyle: Record<string, string> = {
    sent: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    viewed: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    accepted: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    declined: 'bg-red-500/10 text-red-400 border border-red-500/20',
  };

  const statusLabel: Record<string, string> = {
    sent: 'Sent',
    viewed: 'Viewed',
    accepted: 'Accepted',
    declined: 'Declined',
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">My Proposals</h1>
          <p className="text-sm text-slate-500 mt-1">
            Bids you&apos;ve sent to homeowners on ProvenQuote
          </p>
        </div>
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <div className="text-xs font-semibold bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] rounded-full px-4 py-2">
              {pendingCount} awaiting reply
            </div>
          )}
          <Link
            href="/dashboard/leads"
            className="text-sm font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-xl transition-colors"
          >
            Send New Bid
          </Link>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(['all', 'sent', 'accepted', 'declined'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border capitalize ${
              filter === f
                ? 'bg-[#2563EB] border-[#2563EB] text-white'
                : 'bg-[#0F1729] border-white/[0.08] text-slate-400 hover:text-white'
            }`}
          >
            {f === 'all' ? 'All' : f === 'sent' ? 'Pending' : f === 'accepted' ? 'Accepted' : 'Declined'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-16 text-center">
          {proposals.length === 0 ? (
            <>
              <p className="text-slate-400 text-base mb-2">No proposals yet.</p>
              <p className="text-slate-600 text-sm mb-6">
                Go to Lead Inbox to view leads and send your first bid.
              </p>
              <Link
                href="/dashboard/leads"
                className="inline-block text-sm font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-xl transition-colors"
              >
                Go to Lead Inbox
              </Link>
            </>
          ) : (
            <p className="text-slate-500">No proposals match this filter.</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(p => {
            const lead = p.lead;
            const sentDate = new Date(p.created_at).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
            });

            return (
              <div
                key={p.id}
                className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base font-semibold text-white">
                        {lead?.homeowner_name ?? 'Homeowner'}
                      </h3>
                      {lead?.city && (
                        <span className="text-xs text-slate-500">
                          {lead.city}, {lead.state}
                        </span>
                      )}
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyle[p.status]}`}>
                        {statusLabel[p.status]}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-300">
                      {lead?.service_type ?? 'Service'}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">Sent {sentDate}</p>
                  </div>
                  {p.proposed_price != null && (
                    <div className="text-right text-xs text-slate-500">
                      Your bid:{' '}
                      <span className="text-slate-300 font-semibold">
                        ${p.proposed_price.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {lead?.description && (
                  <div className="bg-[#1A2342] rounded-xl p-4 mb-4">
                    <p className="text-xs text-slate-500 mb-2">Their request</p>
                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                      {lead.description}
                    </p>
                    <div className="flex gap-4 mt-2 text-xs text-slate-600">
                      {lead.estimated_budget && (
                        <span>Budget: <span className="text-slate-400">{lead.estimated_budget}</span></span>
                      )}
                      {lead.urgency && (
                        <span>Urgency: <span className="text-slate-400">{lead.urgency}</span></span>
                      )}
                    </div>
                  </div>
                )}

                <div className="border-t border-white/[0.06] pt-4">
                  <p className="text-xs text-slate-500 mb-2">Your bid message</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{p.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

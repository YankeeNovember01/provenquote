'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Lead {
  id: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  city: string | null;
  state: string | null;
  niche: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  tenant_id: string | null;
  is_exclusive: boolean | null;
  purchased_by: string[] | null;
  lead_price: number | null;
  status: string | null;
  business_notes: string | null;
  // UI-only fields
  _purchased?: boolean;
  _status?: string;
}

const STATUSES = ['All', 'New', 'Contacted', 'Won', 'Lost'];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function LeadsPage() {
  const [filter, setFilter] = useState('All');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loadingLeadId, setLoadingLeadId] = useState<string | null>(null);

  const handlePurchaseLead = async (lead: Lead) => {
    setLoadingLeadId(lead.id);
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lead',
          leadId: lead.id,
          leadPrice: lead.lead_price ?? 85,
          niche: lead.niche,
          city: lead.city,
          state: lead.state,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to start checkout');
      }
    } catch {
      alert('Checkout failed. Try again.');
    } finally {
      setLoadingLeadId(null);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setStatuses(prev => ({ ...prev, [leadId]: newStatus }));
    const supabase = createClient();
    await supabase.from('pq_leads').update({ status: newStatus }).eq('id', leadId);
  };

  const handleNotesSave = async (leadId: string, noteText: string) => {
    const supabase = createClient();
    await supabase.from('pq_leads').update({ business_notes: noteText } as Record<string, unknown>).eq('id', leadId);
  };

  useEffect(() => {
    async function fetchLeads() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // Get business
      const { data: business } = await supabase
        .from('pq_businesses')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!business) { setLoading(false); return; }
      setBusinessId(business.id);

      // Get leads assigned to me via lease (tenant_id = my business)
      const { data: myLeads } = await supabase
        .from('pq_leads')
        .select('*')
        .eq('tenant_id', business.id)
        .order('created_at', { ascending: false })
        .limit(100);

      // Get leads I've purchased individually
      const { data: purchased } = await supabase
        .from('pq_lead_purchases')
        .select('lead_id')
        .eq('business_id', business.id);

      const purchasedIds = new Set((purchased ?? []).map((p: { lead_id: string }) => p.lead_id));

      // Get leads available for purchase (no active lease, not exclusive)
      const { data: availableLeads } = await supabase
        .from('pq_leads')
        .select('*')
        .is('tenant_id', null)
        .neq('is_exclusive', true)
        .order('created_at', { ascending: false })
        .limit(50);

      // Merge: my leased leads (fully unlocked) + available leads (locked unless purchased)
      const myLeadIds = new Set((myLeads ?? []).map((l: Lead) => l.id));
      const merged: Lead[] = [
        ...(myLeads ?? []).map((l: Lead) => ({ ...l, _purchased: true, _status: l.status || 'New' })),
        ...(availableLeads ?? [])
          .filter((l: Lead) => !myLeadIds.has(l.id))
          .map((l: Lead) => ({
            ...l,
            _purchased: purchasedIds.has(l.id),
            _status: l.status || 'New',
          })),
      ];

      setLeads(merged);
      setLoading(false);
    }

    fetchLeads();
  }, []);

  // Pre-populate notes and statuses from DB data on first load
  useEffect(() => {
    const initialNotes: Record<string, string> = {};
    const initialStatuses: Record<string, string> = {};
    leads.forEach(l => {
      if (l.business_notes) initialNotes[l.id] = l.business_notes;
      if (l.status) initialStatuses[l.id] = l.status;
    });
    setNotes(prev => ({ ...initialNotes, ...prev }));
    setStatuses(prev => ({ ...initialStatuses, ...prev }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leads]);

  const filtered = leads.filter(l => {
    const status = statuses[l.id] ?? l._status ?? 'New';
    return filter === 'All' || status === filter;
  });

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-white mb-4">Leads</h1>
        <p className="text-slate-500">Loading leads...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-sm text-slate-500 mt-1">
            Leads from your leased markets on ProvenQuote
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
              filter === s
                ? 'bg-[#2563EB] border-[#2563EB] text-white'
                : 'bg-[#0F1729] border-white/[0.08] text-slate-400 hover:text-white'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Lead list */}
      <div className="space-y-3">
        {filtered.map(lead => {
          const name = [lead.first_name, lead.last_name].filter(Boolean).join(' ') || 'Anonymous';
          const location = [lead.city, lead.state].filter(Boolean).join(', ') || '—';
          const currentStatus = statuses[lead.id] ?? lead._status ?? 'New';
          const isExpanded = expanded === lead.id;
          const isPurchased = lead._purchased;

          return (
            <div
              key={lead.id}
              className={`bg-[#0F1729] border rounded-2xl transition-all ${
                isExpanded ? 'border-[#2563EB]/30' : 'border-white/[0.08]'
              }`}
            >
              {/* Row */}
              <div
                className="flex items-center gap-4 px-6 py-4 cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : lead.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-white">{name}</p>
                    <span className="text-xs text-slate-500">{location}</span>
                    <span className="text-xs text-slate-600">{formatDate(lead.created_at)}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{lead.niche || 'General'}</p>
                </div>

                <div className="flex items-center gap-3">
                  {!isPurchased && (
                    <span className="text-xs text-slate-500 italic">Contact locked</span>
                  )}
                  <select
                    value={currentStatus}
                    onChange={e => {
                      e.stopPropagation();
                      handleStatusChange(lead.id, e.target.value);
                    }}
                    onClick={e => e.stopPropagation()}
                    className="bg-[#1A2342] border border-white/10 text-white rounded-lg px-3 py-1.5 text-xs"
                  >
                    {['New', 'Contacted', 'Won', 'Lost'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <span className="text-slate-600 text-sm">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-white/[0.06] pt-5">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Left: description + notes */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">What they need</h4>
                      <p className="text-sm text-slate-300 leading-relaxed mb-5">
                        {lead.description || 'No description provided.'}
                      </p>

                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Your notes</h4>
                      <textarea
                        value={notes[lead.id] ?? ''}
                        onChange={e => setNotes(prev => ({ ...prev, [lead.id]: e.target.value }))}
                        onBlur={e => handleNotesSave(lead.id, e.target.value)}
                        placeholder="Add notes..."
                        className="w-full bg-[#1A2342] border border-white/10 text-white rounded-xl px-4 py-3 text-sm resize-none h-20 placeholder-slate-600 focus:outline-none focus:border-[#2563EB]/40"
                      />
                    </div>

                    {/* Right: contact */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Contact</h4>
                      {isPurchased ? (
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-slate-600 mb-1">Phone</p>
                            {lead.phone ? (
                              <a href={`tel:${lead.phone}`} className="text-sm font-medium text-[#2563EB]">{lead.phone}</a>
                            ) : (
                              <span className="text-sm text-slate-500">Not provided</span>
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-slate-600 mb-1">Email</p>
                            {lead.email ? (
                              <a href={`mailto:${lead.email}`} className="text-sm text-[#2563EB]">{lead.email}</a>
                            ) : (
                              <span className="text-sm text-slate-500">Not provided</span>
                            )}
                          </div>
                          {(lead.phone || lead.email) && (
                            <div className="mt-4 flex gap-2">
                              {lead.phone && (
                                <a
                                  href={`tel:${lead.phone}`}
                                  className="flex-1 text-center text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3 py-2.5 rounded-xl transition-colors"
                                >
                                  Call Now
                                </a>
                              )}
                              {lead.email && (
                                <a
                                  href={`mailto:${lead.email}`}
                                  className="flex-1 text-center text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-2.5 rounded-xl transition-colors"
                                >
                                  Send Email
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-[#1A2342] border border-white/[0.08] rounded-xl p-5 text-center">
                          <p className="text-sm text-slate-400 mb-1">Contact info locked</p>
                          <p className="text-xs text-slate-600 mb-4">Purchase this lead to unlock phone and email</p>
                          <button
                            onClick={e => { e.stopPropagation(); handlePurchaseLead(lead); }}
                            disabled={loadingLeadId === lead.id}
                            className="w-full text-xs font-bold bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white px-4 py-2.5 rounded-lg transition-colors"
                          >
                            {loadingLeadId === lead.id ? 'Redirecting...' : `Unlock Lead — $${lead.lead_price ?? 85}`}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-16 text-center">
          {leads.length === 0 ? (
            <>
              <p className="text-slate-400 mb-2">No leads yet.</p>
              <p className="text-slate-600 text-sm">Lease a market to start receiving exclusive leads.</p>
            </>
          ) : (
            <p className="text-slate-500">No leads in this status.</p>
          )}
        </div>
      )}
    </div>
  );
}

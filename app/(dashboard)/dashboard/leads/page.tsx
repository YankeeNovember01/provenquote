'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Lead {
  id: string;
  created_at: string;
  homeowner_name: string | null;
  first_name: string | null;
  last_name: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
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
  urgency: string | null;
  estimated_budget: string | null;
  has_insurance: boolean | null;
  lead_score: number | null;
  damage_cause: string | null;
  wants_inspection: boolean | null;
  roof_age: number | null;
  service_type: string | null;
  // UI-only fields
  _purchased?: boolean;
  _status?: string;
}

interface BusinessProfile {
  id: string;
  niche: string | null;
  city: string | null;
  state: string | null;
}

const STATUSES = ['All', 'New', 'Contacted', 'Won', 'Lost'];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getUrgencyLabel(urgency: string | null) {
  switch (urgency?.toLowerCase()) {
    case 'emergency': return { label: '🔥 Emergency', cls: 'bg-red-500/15 text-red-400 border-red-500/20' };
    case 'this_week':
    case 'this week': return { label: '⚡ This week', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/20' };
    case 'planning':
    case 'planning_ahead':
    case 'planning ahead': return { label: '📅 Planning ahead', cls: 'bg-blue-500/15 text-blue-400 border-blue-500/20' };
    default: return null;
  }
}

function getMatchScore(lead: Lead, businessNiche: string | null, businessCity: string | null, businessState: string | null): number {
  let score = 0;
  if (businessNiche && lead.niche?.toLowerCase() === businessNiche.toLowerCase()) score += 50;
  if (businessState && lead.state?.toLowerCase() === businessState.toLowerCase()) score += 30;
  if (businessCity && lead.city?.toLowerCase() === businessCity.toLowerCase()) score += 20;
  if (lead.urgency?.toLowerCase() === 'emergency') score += 10;
  return Math.min(score, 100);
}

function MatchScoreDot({ score }: { score: number }) {
  const color = score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-slate-600';
  return (
    <span className={`text-xs font-semibold ${color} flex items-center gap-1`}>
      <span className="text-base leading-none">●</span> {score}% match
    </span>
  );
}

function LeadScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-slate-400 tabular-nums">{score}/100</span>
    </div>
  );
}

const LS_NICHE = 'pq_leads_filter_niche';
const LS_LOCATION = 'pq_leads_filter_location';
const LS_URGENCY = 'pq_leads_filter_urgency';

export default function LeadsPage() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [nicheFilter, setNicheFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('All');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingLeadId, setLoadingLeadId] = useState<string | null>(null);
  const [writingBidFor, setWritingBidFor] = useState<string | null>(null);
  const [bidDraft, setBidDraft] = useState<{ leadId: string; text: string } | null>(null);
  const [newLeadToast, setNewLeadToast] = useState(false);
  const [newLeadCount, setNewLeadCount] = useState(0);

  // Restore filters from localStorage
  useEffect(() => {
    const savedNiche = localStorage.getItem(LS_NICHE);
    const savedLocation = localStorage.getItem(LS_LOCATION);
    const savedUrgency = localStorage.getItem(LS_URGENCY);
    if (savedLocation) setLocationFilter(savedLocation);
    if (savedUrgency) setUrgencyFilter(savedUrgency);
    // Niche is set from profile on load; only restore if explicitly set by user
    if (savedNiche) setNicheFilter(savedNiche);
  }, []);

  const handleWriteBid = async (leadId: string) => {
    setWritingBidFor(leadId);
    try {
      const res = await fetch('/api/ai/bid-writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId }),
      });
      const { proposal, error } = await res.json();
      if (error) throw new Error(error);
      setBidDraft({ leadId, text: proposal });
    } catch {
      alert('Failed to generate bid. Try again.');
    } finally {
      setWritingBidFor(null);
    }
  };

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

      // Get business profile (niche + location for match scoring and default filter)
      const { data: biz } = await supabase
        .from('pq_businesses')
        .select('id, niche, city, state')
        .eq('user_id', user.id)
        .single();

      if (!biz) { setLoading(false); return; }
      setBusiness(biz);

      // Auto-populate niche filter from profile (only if user hasn't explicitly overridden)
      const savedNiche = localStorage.getItem(LS_NICHE);
      if (!savedNiche && biz.niche) {
        setNicheFilter(biz.niche);
      }

      // Get leads assigned to me via lease
      const { data: myLeads } = await supabase
        .from('pq_leads')
        .select('*')
        .eq('tenant_id', biz.id)
        .order('created_at', { ascending: false })
        .limit(100);

      // Get leads I've purchased individually
      const { data: purchased } = await supabase
        .from('pq_lead_purchases')
        .select('lead_id')
        .eq('business_id', biz.id);

      const purchasedIds = new Set((purchased ?? []).map((p: { lead_id: string }) => p.lead_id));

      // Get leads available for purchase
      const { data: availableLeads } = await supabase
        .from('pq_leads')
        .select('*')
        .is('tenant_id', null)
        .neq('is_exclusive', true)
        .order('created_at', { ascending: false })
        .limit(50);

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

  // ── Supabase Realtime: listen for new leads ────────────────────────────────
  useEffect(() => {
    const supabase = createClient();

    const subscription = supabase
      .channel('pq_leads_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'pq_leads',
        },
        (payload) => {
          const newLead = payload.new as Lead;
          setLeads(prev => {
            if (prev.find(l => l.id === newLead.id)) return prev;
            return [{ ...newLead, _purchased: false, _status: newLead.status || 'New' }, ...prev];
          });
          setNewLeadCount(c => c + 1);
          setNewLeadToast(true);
          setTimeout(() => setNewLeadToast(false), 5000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

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

  const handleNicheFilterChange = (value: string) => {
    setNicheFilter(value);
    localStorage.setItem(LS_NICHE, value);
  };
  const handleLocationFilterChange = (value: string) => {
    setLocationFilter(value);
    localStorage.setItem(LS_LOCATION, value);
  };
  const handleUrgencyFilterChange = (value: string) => {
    setUrgencyFilter(value);
    localStorage.setItem(LS_URGENCY, value);
  };

  const filtered = leads.filter(l => {
    const status = statuses[l.id] ?? l._status ?? 'New';
    if (statusFilter !== 'All' && status !== statusFilter) return false;
    if (nicheFilter && l.niche?.toLowerCase() !== nicheFilter.toLowerCase()) return false;
    if (locationFilter) {
      const loc = locationFilter.toLowerCase();
      const inCity = l.city?.toLowerCase().includes(loc);
      const inState = l.state?.toLowerCase().includes(loc);
      if (!inCity && !inState) return false;
    }
    if (urgencyFilter !== 'All') {
      if (urgencyFilter === 'Emergency' && l.urgency?.toLowerCase() !== 'emergency') return false;
      if (urgencyFilter === 'This week' && !['this_week', 'this week'].includes(l.urgency?.toLowerCase() ?? '')) return false;
      if (urgencyFilter === 'Planning ahead' && !['planning', 'planning_ahead', 'planning ahead'].includes(l.urgency?.toLowerCase() ?? '')) return false;
    }
    return true;
  });

  const allNiches = [...new Set(leads.map(l => l.niche).filter(Boolean))].sort() as string[];

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
      {/* Real-time new lead toast */}
      {newLeadToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-right">
          <span className="text-lg">🔔</span>
          <div>
            <p className="font-semibold text-sm">New lead just came in!</p>
            <p className="text-xs opacity-80">Check your lead inbox</p>
          </div>
          <button onClick={() => setNewLeadToast(false)} className="ml-2 opacity-70 hover:opacity-100 text-lg leading-none">&times;</button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads {newLeadCount > 0 && <span className="ml-2 text-sm bg-green-600 text-white rounded-full px-2 py-0.5 align-middle">{newLeadCount} new</span>}</h1>
          <p className="text-sm text-slate-500 mt-1">
            Leads from your leased markets on ProvenQuote
          </p>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Status tabs */}
        <div className="flex gap-1.5">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                statusFilter === s
                  ? 'bg-[#2563EB] border-[#2563EB] text-white'
                  : 'bg-[#0F1729] border-white/[0.08] text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Niche filter */}
        <select
          value={nicheFilter}
          onChange={e => handleNicheFilterChange(e.target.value)}
          className="bg-[#0F1729] border border-white/[0.08] text-white rounded-lg px-3 py-1.5 text-xs"
        >
          <option value="">All Niches</option>
          {allNiches.map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>

        {/* Location filter */}
        <input
          type="text"
          value={locationFilter}
          onChange={e => handleLocationFilterChange(e.target.value)}
          placeholder="Filter by city or state..."
          className="bg-[#0F1729] border border-white/[0.08] text-white rounded-lg px-3 py-1.5 text-xs placeholder-slate-600 focus:outline-none focus:border-[#2563EB]/40 min-w-[180px]"
        />

        {/* Urgency filter */}
        <select
          value={urgencyFilter}
          onChange={e => handleUrgencyFilterChange(e.target.value)}
          className="bg-[#0F1729] border border-white/[0.08] text-white rounded-lg px-3 py-1.5 text-xs"
        >
          <option value="All">All Urgencies</option>
          <option value="Emergency">🔥 Emergency</option>
          <option value="This week">⚡ This week</option>
          <option value="Planning ahead">📅 Planning ahead</option>
        </select>

        {/* Clear filters */}
        {(nicheFilter || locationFilter || urgencyFilter !== 'All' || statusFilter !== 'All') && (
          <button
            onClick={() => {
              setStatusFilter('All');
              handleNicheFilterChange('');
              handleLocationFilterChange('');
              handleUrgencyFilterChange('All');
            }}
            className="text-xs text-slate-500 hover:text-white px-2 py-1.5 transition-colors"
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Lead list */}
      <div className="space-y-3">
        {filtered.map(lead => {
          const name = lead.homeowner_name || [lead.first_name, lead.last_name].filter(Boolean).join(' ') || 'Anonymous';
          const location = [lead.city, lead.state].filter(Boolean).join(', ') || '—';
          const currentStatus = statuses[lead.id] ?? lead._status ?? 'New';
          const isExpanded = expandedLeadId === lead.id;
          const isPurchased = lead._purchased;
          const urgencyInfo = getUrgencyLabel(lead.urgency);
          const matchScore = business ? getMatchScore(lead, business.niche, business.city, business.state) : 0;

          return (
            <div
              key={lead.id}
              className={`bg-[#0F1729] border rounded-2xl transition-all ${
                isExpanded ? 'border-[#2563EB]/30' : 'border-white/[0.08]'
              }`}
            >
              {/* Collapsed row — click to expand */}
              <div
                className="flex items-center gap-4 px-6 py-4 cursor-pointer"
                onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-white">{name}</p>
                    <span className="text-xs text-slate-500">{location}</span>
                    <span className="text-xs text-slate-600">{formatDate(lead.created_at)}</span>
                    {urgencyInfo && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${urgencyInfo.cls}`}>
                        {urgencyInfo.label}
                      </span>
                    )}
                    {lead.has_insurance && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-sky-500/10 text-sky-400 border-sky-500/20">
                        🏠 Insurance claim
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs text-slate-400">{lead.niche || 'General'} {lead.service_type ? `· ${lead.service_type}` : ''}</p>
                    {business && matchScore > 0 && <MatchScoreDot score={matchScore} />}
                    {lead.lead_score != null && (
                      <span className="text-xs text-slate-500">Lead score: {lead.lead_score}</span>
                    )}
                  </div>
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

              {/* Expanded section */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-white/[0.06] pt-5 space-y-5">
                  {/* Rich preview — visible before purchase */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Left: full details */}
                    <div className="space-y-4">
                      {/* Badges row */}
                      <div className="flex flex-wrap gap-2">
                        {urgencyInfo && (
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${urgencyInfo.cls}`}>
                            {urgencyInfo.label}
                          </span>
                        )}
                        {lead.has_insurance && (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-sky-500/10 text-sky-400 border-sky-500/20">
                            🏠 Insurance claim
                          </span>
                        )}
                        {lead.estimated_budget && (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                            💰 {lead.estimated_budget}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">What they need</h4>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {lead.description || 'No description provided.'}
                        </p>
                      </div>

                      {/* Service specifics */}
                      {(lead.damage_cause || lead.roof_age != null || lead.wants_inspection != null) && (
                        <div>
                          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Service specifics</h4>
                          <div className="space-y-1.5 text-xs text-slate-400">
                            {lead.damage_cause && (
                              <p>Damage cause: <span className="text-slate-300">{lead.damage_cause}</span></p>
                            )}
                            {lead.roof_age != null && (
                              <p>Roof age: <span className="text-slate-300">{lead.roof_age} years</span></p>
                            )}
                            {lead.wants_inspection != null && (
                              <p>Wants inspection: <span className="text-slate-300">{lead.wants_inspection ? 'Yes' : 'No'}</span></p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Lead score */}
                      {lead.lead_score != null && (
                        <div>
                          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Lead quality score</h4>
                          <LeadScoreBar score={lead.lead_score} />
                        </div>
                      )}
                    </div>

                    {/* Right: contact (locked or unlocked) */}
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
                          {/* AI Bid Writer */}
                          <div className="mt-4">
                            <button
                              onClick={e => { e.stopPropagation(); handleWriteBid(lead.id); }}
                              disabled={writingBidFor === lead.id}
                              className="w-full text-xs font-medium bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 hover:text-blue-300 px-3 py-2 rounded-lg transition-all disabled:opacity-50"
                            >
                              {writingBidFor === lead.id ? '✨ Writing bid...' : '✨ Write Bid Proposal'}
                            </button>
                            {bidDraft?.leadId === lead.id && (
                              <div className="mt-3 bg-[#0A1020] border border-white/[0.06] rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Generated Bid Proposal</p>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(bidDraft.text); }}
                                      className="text-[10px] text-blue-400 hover:text-blue-300 transition"
                                    >
                                      Copy
                                    </button>
                                    <button
                                      onClick={e => { e.stopPropagation(); setBidDraft(null); }}
                                      className="text-[10px] text-slate-600 hover:text-slate-400 transition"
                                    >
                                      Dismiss
                                    </button>
                                  </div>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{bidDraft.text}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-[#1A2342] border border-white/[0.08] rounded-xl p-5 text-center">
                          <p className="text-2xl mb-2">🔒</p>
                          <p className="text-sm text-slate-400 mb-1">Contact info locked</p>
                          <p className="text-xs text-slate-600 mb-1">
                            {lead.homeowner_name ? (
                              <span className="blur-sm select-none">███████ ████████</span>
                            ) : (
                              'Name hidden'
                            )}
                          </p>
                          <p className="text-xs text-slate-600 mb-4">Purchase to unlock phone and email</p>
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

                  {/* Notes (only for purchased leads) */}
                  {isPurchased && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Your notes</h4>
                      <textarea
                        value={notes[lead.id] ?? ''}
                        onChange={e => setNotes(prev => ({ ...prev, [lead.id]: e.target.value }))}
                        onBlur={e => handleNotesSave(lead.id, e.target.value)}
                        placeholder="Add notes..."
                        className="w-full bg-[#1A2342] border border-white/10 text-white rounded-xl px-4 py-3 text-sm resize-none h-20 placeholder-slate-600 focus:outline-none focus:border-[#2563EB]/40"
                      />
                    </div>
                  )}
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
            <>
              <p className="text-slate-500 mb-1">No leads match your filters.</p>
              <button
                onClick={() => {
                  setStatusFilter('All');
                  handleNicheFilterChange('');
                  handleLocationFilterChange('');
                  handleUrgencyFilterChange('All');
                }}
                className="text-xs text-[#2563EB] hover:text-white mt-2 transition-colors"
              >
                Clear all filters
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

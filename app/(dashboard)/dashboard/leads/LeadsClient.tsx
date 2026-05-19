'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type UrgencyLevel = 'Critical' | 'High' | 'Medium' | 'Low';
type LeadStatus = 'new' | 'contacted' | 'bid_sent' | 'won' | 'lost';

interface Lead {
  id: string;
  created_at: string;
  niche: string;
  city: string;
  state: string;
  zip: string;
  homeowner_name: string;
  phone: string;
  email: string;
  service_type: string;
  urgency: UrgencyLevel;
  description: string;
  has_insurance: boolean;
  adjuster_visited: boolean;
  damage_cause: string;
  wants_inspection: boolean;
  roof_age: number | null;
  roof_size_sqft: number | null;
  estimated_budget: string;
  status: LeadStatus;
  lead_score: number;
  source_hub: string;
  purchased_by: string[];
}

const STATUS_WORKFLOW: LeadStatus[] = ['new', 'contacted', 'bid_sent', 'won', 'lost'];
const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  bid_sent: 'Bid Sent',
  won: 'Won',
  lost: 'Lost',
};

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  contacted: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  bid_sent: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  won: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  lost: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

const URGENCY_COLORS: Record<string, string> = {
  Critical: 'bg-red-500/15 text-red-400 border border-red-500/30',
  High: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  Medium: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  Low: 'bg-slate-500/15 text-slate-400 border border-slate-500/30',
};

const SCORE_COLOR = (score: number) => {
  if (score >= 85) return 'text-emerald-400';
  if (score >= 65) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-slate-500';
};

const STATUS_NEXT: Record<LeadStatus, LeadStatus | null> = {
  new: 'contacted',
  contacted: 'bid_sent',
  bid_sent: 'won',
  won: null,
  lost: null,
};

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

interface Props {
  initialLeads: Record<string, unknown>[];
  businessId: string;
  purchasedLeadIds: string[];
  hasLeases: boolean;
}

export default function LeadsClient({ initialLeads, businessId, purchasedLeadIds, hasLeases }: Props) {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>(initialLeads as unknown as Lead[]);
  const [purchased, setPurchased] = useState<Set<string>>(new Set(purchasedLeadIds));
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'score' | 'recent'>('score');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [unlockingId, setUnlockingId] = useState<string | null>(null);

  const updateStatus = async (id: string, status: LeadStatus) => {
    setLeads(prev => prev.map(l => (l.id === id ? { ...l, status } : l)));
    // Optimistic — no server sync yet (add a status column update API if needed)
  };

  const handleUnlockLead = async (lead: Lead) => {
    setUnlockingId(lead.id);
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lead',
          leadId: lead.id,
          niche: lead.niche,
          city: lead.city,
          state: lead.state,
          leadPrice: 85,
        }),
      });
      const { url, error } = await res.json();
      if (error) {
        alert('Error: ' + error);
      } else if (url) {
        window.location.href = url;
      }
    } catch {
      alert('Something went wrong');
    }
    setUnlockingId(null);
  };

  const isPurchased = (lead: Lead) => {
    return purchased.has(lead.id) ||
      (lead.purchased_by && lead.purchased_by.includes(businessId));
  };

  const filtered = leads
    .filter(l => selectedStatus === 'All' || l.status === selectedStatus)
    .sort((a, b) => {
      if (sortBy === 'score') return b.lead_score - a.lead_score;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const counts = STATUS_WORKFLOW.reduce<Record<string, number>>((acc, s) => {
    acc[s] = leads.filter(l => l.status === s).length;
    return acc;
  }, {});

  if (!hasLeases && leads.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-white mb-4">Lead Inbox</h1>
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-12 text-center">
          <p className="text-slate-400 mb-2">You don&apos;t have any active market leases yet.</p>
          <p className="text-slate-500 text-sm mb-6">Lease a market to start receiving exclusive leads from your area.</p>
          <a
            href="/dashboard/markets"
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-block"
          >
            Browse Markets →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Lead Inbox</h1>
          <p className="text-sm text-slate-500 mt-1">
            {leads.filter(l => l.status === 'new').length} new leads waiting
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.refresh()}
            className="text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Status pipeline bar */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {(['All', ...STATUS_WORKFLOW] as const).map(s => {
          const label = s === 'All' ? 'All' : STATUS_LABELS[s as LeadStatus];
          const count = s === 'All' ? leads.length : (counts[s as LeadStatus] ?? 0);
          const active = selectedStatus === s;
          return (
            <button
              key={s}
              onClick={() => setSelectedStatus(s)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border ${
                active
                  ? 'bg-[#2563EB] border-[#2563EB] text-white'
                  : 'bg-[#0F1729] border-white/[0.08] text-slate-400 hover:text-white'
              }`}
            >
              {label}
              <span className={`text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${active ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-500'}`}>
                {count}
              </span>
            </button>
          );
        })}

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-600">Sort:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="bg-[#1A2342] border border-white/10 text-white rounded-lg px-3 py-2 text-xs"
          >
            <option value="score">Lead Score</option>
            <option value="recent">Newest First</option>
          </select>
        </div>
      </div>

      {/* Lead Cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-12 text-center">
            <p className="text-slate-500">No leads in this status.</p>
          </div>
        )}

        {filtered.map(lead => {
          const expanded = expandedId === lead.id;
          const nextStatus = STATUS_NEXT[lead.status];
          const unlocked = isPurchased(lead);

          return (
            <div
              key={lead.id}
              className={`bg-[#0F1729] border rounded-2xl transition-all ${
                expanded ? 'border-[#2563EB]/40' : 'border-white/[0.08] hover:border-white/[0.16]'
              }`}
            >
              {/* Card Header */}
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Score bubble */}
                  <div className="shrink-0 w-14 h-14 rounded-xl bg-[#1A2342] flex flex-col items-center justify-center">
                    <span className={`text-lg font-bold leading-none ${SCORE_COLOR(lead.lead_score)}`}>{lead.lead_score}</span>
                    <span className="text-[9px] text-slate-600 mt-0.5">score</span>
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="text-base font-semibold text-white">{lead.homeowner_name}</h3>
                      <span className="text-slate-600">·</span>
                      <span className="text-sm text-slate-400">{lead.city}, {lead.state}</span>
                      <span className="text-xs text-slate-600">{timeAgo(lead.created_at)}</span>
                    </div>

                    {/* Service + badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-slate-200">{lead.service_type}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${URGENCY_COLORS[lead.urgency] || URGENCY_COLORS.Medium}`}>
                        {lead.urgency}
                      </span>
                      {lead.has_insurance && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          🛡 Insurance
                        </span>
                      )}
                      {lead.adjuster_visited && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          ✓ Adjuster Visited
                        </span>
                      )}
                      {lead.wants_inspection && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          🔍 Wants Inspection
                        </span>
                      )}
                      {lead.estimated_budget && lead.estimated_budget !== 'Unknown' && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          💰 {lead.estimated_budget}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                      &ldquo;{lead.description}&rdquo;
                    </p>
                  </div>

                  {/* Right column — status + actions */}
                  <div className="shrink-0 flex flex-col items-end gap-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[lead.status]}`}>
                      {STATUS_LABELS[lead.status]}
                    </span>

                    <div className="flex items-center gap-2">
                      {nextStatus && (
                        <button
                          onClick={() => updateStatus(lead.id, nextStatus)}
                          className="text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                        >
                          → {STATUS_LABELS[nextStatus]}
                        </button>
                      )}
                      {lead.status !== 'lost' && lead.status !== 'won' && (
                        <button
                          onClick={() => updateStatus(lead.id, 'lost')}
                          className="text-xs font-medium text-slate-600 hover:text-red-400 px-2 py-1.5 transition-colors"
                        >
                          Lost
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => setExpandedId(expanded ? null : lead.id)}
                      className="text-xs text-slate-500 hover:text-white transition-colors"
                    >
                      {expanded ? '▲ Less' : '▼ Details'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded panel */}
              {expanded && (
                <div className="border-t border-white/[0.08] p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Contact info */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Contact</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600 w-16">Phone</span>
                          {unlocked ? (
                            <a href={`tel:${lead.phone}`} className="text-sm font-medium text-[#2563EB] hover:text-white transition-colors font-mono">{lead.phone}</a>
                          ) : (
                            <span className="text-sm text-slate-600 italic">🔒 Unlock upon purchase</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600 w-16">Email</span>
                          {unlocked ? (
                            <a href={`mailto:${lead.email}`} className="text-sm text-[#2563EB] hover:text-white transition-colors truncate">{lead.email}</a>
                          ) : (
                            <span className="text-sm text-slate-600 italic">🔒 Unlock upon purchase</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600 w-16">ZIP</span>
                          <span className="text-sm text-slate-300 font-mono">{lead.zip}</span>
                        </div>
                      </div>
                      {!unlocked && (
                        <button
                          onClick={() => handleUnlockLead(lead)}
                          disabled={unlockingId === lead.id}
                          className="mt-4 w-full text-xs font-bold bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white px-4 py-2.5 rounded-xl transition-colors"
                        >
                          {unlockingId === lead.id ? 'Redirecting...' : 'Unlock This Lead — $85'}
                        </button>
                      )}
                    </div>

                    {/* Qualification data */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Qualification</h4>
                      <div className="space-y-2">
                        {lead.damage_cause && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Damage cause</span>
                            <span className="text-slate-200">{lead.damage_cause}</span>
                          </div>
                        )}
                        {lead.roof_age && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Roof age</span>
                            <span className="text-slate-200">{lead.roof_age} years</span>
                          </div>
                        )}
                        {lead.roof_size_sqft && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Roof size</span>
                            <span className="text-slate-200">{lead.roof_size_sqft.toLocaleString()} sqft</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Insurance</span>
                          <span className={lead.has_insurance ? 'text-emerald-400' : 'text-slate-500'}>{lead.has_insurance ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Adjuster visited</span>
                          <span className={lead.adjuster_visited ? 'text-emerald-400' : 'text-slate-500'}>{lead.adjuster_visited ? 'Yes' : 'No'}</span>
                        </div>
                        {lead.estimated_budget && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Budget range</span>
                            <span className="text-amber-400 font-medium">{lead.estimated_budget}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Notes + actions */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Notes</h4>
                      <textarea
                        value={notesMap[lead.id] ?? ''}
                        onChange={e => setNotesMap(prev => ({ ...prev, [lead.id]: e.target.value }))}
                        placeholder="Add notes about this lead..."
                        className="w-full bg-[#1A2342] border border-white/10 text-white rounded-xl px-4 py-3 text-sm resize-none h-24 placeholder-slate-600 focus:outline-none focus:border-[#2563EB]/50"
                      />
                      <div className="mt-3 flex gap-2">
                        <a
                          href={`/dashboard/bids?leadId=${lead.id}&name=${encodeURIComponent(lead.homeowner_name)}&service=${encodeURIComponent(lead.service_type)}`}
                          className="flex-1 text-center text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3 py-2 rounded-lg transition-colors"
                        >
                          Create Bid →
                        </a>
                        <a
                          href={`/dashboard/messages?leadId=${lead.id}`}
                          className="flex-1 text-center text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-2 rounded-lg transition-colors"
                        >
                          Message
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

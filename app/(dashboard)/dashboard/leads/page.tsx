'use client';

import { useState } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────
type UrgencyLevel = 'Critical' | 'High' | 'Medium' | 'Low';
type LeadStatus = 'New' | 'Contacted' | 'Bid Sent' | 'Won' | 'Lost';

interface Lead {
  id: number;
  receivedAt: string;
  niche: string;
  city: string;
  state: string;
  zip: string;
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  urgency: UrgencyLevel;
  purchased: boolean; // true = included in lease or already bought
  description: string;
  hasInsurance: boolean;
  insuranceAdjusterVisited: boolean;
  damageCause: string;
  wantsInspection: boolean;
  roofAge: number | null;
  roofSizeSqft: number | null;
  estimatedBudget: string;
  status: LeadStatus;
  score: number;
  hub: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────
const LEADS: Lead[] = [
  {
    id: 1,
    receivedAt: '2 hours ago',
    niche: 'Roofing',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    name: 'James Carter',
    phone: '(512) 555-0198',
    email: 'jcarter@email.com',
    serviceType: 'Full Roof Replacement',
    urgency: 'Critical',
    description: 'Major hail storm hit last week. Insurance adjuster already visited and confirmed coverage. Need full replacement ASAP before more rain.',
    hasInsurance: true,
    insuranceAdjusterVisited: true,
    damageCause: 'Hail',
    wantsInspection: false,
    roofAge: 14,
    roofSizeSqft: 2400,
    estimatedBudget: '$15,000–$22,000',
    status: 'New',
    score: 98,
    hub: 'Roofing — Austin, TX',
    purchased: true,
  },
  {
    id: 2,
    receivedAt: '4 hours ago',
    niche: 'Roofing',
    city: 'Austin',
    state: 'TX',
    zip: '78745',
    name: 'Maria Santos',
    phone: '(512) 555-0134',
    email: 'msantos@gmail.com',
    serviceType: 'Hail Damage Repair',
    urgency: 'High',
    description: 'Storm damage to several shingles, possible leak forming. Want inspection and estimate. Insurance not yet filed.',
    hasInsurance: true,
    insuranceAdjusterVisited: false,
    damageCause: 'Hail',
    wantsInspection: true,
    roofAge: 8,
    roofSizeSqft: 1800,
    estimatedBudget: '$3,000–$8,000',
    status: 'New',
    score: 82,
    hub: 'Roofing — Austin, TX',
    purchased: true,
  },
  {
    id: 3,
    receivedAt: '6 hours ago',
    niche: 'Roofing',
    city: 'Austin',
    state: 'TX',
    zip: '78758',
    name: 'Derek Williams',
    phone: '(512) 555-0276',
    email: 'derek.w@email.com',
    serviceType: 'Roof Repair',
    urgency: 'Medium',
    description: 'Noticed a leak in my master bedroom after the last rain. Not sure of the extent. Looking for inspection and repair quote.',
    hasInsurance: false,
    insuranceAdjusterVisited: false,
    damageCause: 'Wear & Tear',
    wantsInspection: true,
    roofAge: 18,
    roofSizeSqft: 2100,
    estimatedBudget: '$1,500–$5,000',
    status: 'Contacted',
    score: 65,
    hub: 'Roofing — Austin, TX',
    purchased: false,
  },
  {
    id: 4,
    receivedAt: '1 day ago',
    niche: 'Roofing',
    city: 'Austin',
    state: 'TX',
    zip: '78704',
    name: 'Linda Park',
    phone: '(512) 555-0091',
    email: 'linda.park@gmail.com',
    serviceType: 'Free Inspection',
    urgency: 'Low',
    description: 'Just bought the home and want a full inspection. No known issues but the roof is getting old.',
    hasInsurance: false,
    insuranceAdjusterVisited: false,
    damageCause: 'None known',
    wantsInspection: true,
    roofAge: 12,
    roofSizeSqft: 1600,
    estimatedBudget: 'Unknown',
    status: 'Bid Sent',
    score: 41,
    hub: 'Roofing — Austin, TX',
    purchased: false,
  },
  {
    id: 5,
    receivedAt: '1 day ago',
    niche: 'Roofing',
    city: 'Austin',
    state: 'TX',
    zip: '78748',
    name: 'Tom Bradley',
    phone: '(512) 555-0183',
    email: 'tombradley@gmail.com',
    serviceType: 'Full Roof Replacement',
    urgency: 'High',
    description: 'Insurance approved my claim after the May storm. Adjuster gave me $18,500. Looking for bids to get work done by end of month.',
    hasInsurance: true,
    insuranceAdjusterVisited: true,
    damageCause: 'Wind',
    wantsInspection: false,
    roofAge: 20,
    roofSizeSqft: 2800,
    estimatedBudget: '$17,000–$21,000',
    status: 'New',
    score: 94,
    hub: 'Roofing — Austin, TX',
    purchased: true,
  },
  {
    id: 6,
    receivedAt: '2 days ago',
    niche: 'Roofing',
    city: 'Austin',
    state: 'TX',
    zip: '78723',
    name: 'Rachel Green',
    phone: '(512) 555-0177',
    email: 'rgreen@gmail.com',
    serviceType: 'Skylight Repair',
    urgency: 'Medium',
    description: 'Skylight has a crack and is leaking when it rains. Need repair or replacement.',
    hasInsurance: false,
    insuranceAdjusterVisited: false,
    damageCause: 'Hail',
    wantsInspection: false,
    roofAge: 10,
    roofSizeSqft: null,
    estimatedBudget: '$800–$2,500',
    status: 'Won',
    score: 58,
    hub: 'Roofing — Austin, TX',
    purchased: false,
  },
];

// ─── Constants ───────────────────────────────────────────────────────────────
const STATUS_WORKFLOW: LeadStatus[] = ['New', 'Contacted', 'Bid Sent', 'Won', 'Lost'];

const STATUS_COLORS: Record<LeadStatus, string> = {
  New: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  Contacted: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  'Bid Sent': 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  Won: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  Lost: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

const STATUS_NEXT: Record<LeadStatus, LeadStatus | null> = {
  New: 'Contacted',
  Contacted: 'Bid Sent',
  'Bid Sent': 'Won',
  Won: null,
  Lost: null,
};

const URGENCY_COLORS: Record<UrgencyLevel, string> = {
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

// ─── Component ───────────────────────────────────────────────────────────────
export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(LEADS);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'score' | 'receivedAt' | 'budget'>('score');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [notesMap, setNotesMap] = useState<Record<number, string>>({});

  const updateStatus = (id: number, status: LeadStatus) => {
    setLeads(prev => prev.map(l => (l.id === id ? { ...l, status } : l)));
  };

  const filtered = leads
    .filter(l => selectedStatus === 'All' || l.status === selectedStatus)
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      return 0;
    });

  const counts = STATUS_WORKFLOW.reduce<Record<string, number>>((acc, s) => {
    acc[s] = leads.filter(l => l.status === s).length;
    return acc;
  }, {});

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Lead Inbox</h1>
          <p className="text-sm text-slate-500 mt-1">
            {leads.filter(l => l.status === 'New').length} new leads waiting
          </p>
        </div>
        <div className="flex gap-3">
          <button className="text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      {/* Status pipeline bar */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {(['All', ...STATUS_WORKFLOW] as const).map(s => {
          const count = s === 'All' ? leads.length : (counts[s] ?? 0);
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
              {s}
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
            <option value="receivedAt">Newest First</option>
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
                    <span className={`text-lg font-bold leading-none ${SCORE_COLOR(lead.score)}`}>{lead.score}</span>
                    <span className="text-[9px] text-slate-600 mt-0.5">score</span>
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="text-base font-semibold text-white">{lead.name}</h3>
                      <span className="text-slate-600">·</span>
                      <span className="text-sm text-slate-400">{lead.city}, {lead.state}</span>
                      <span className="text-xs text-slate-600">{lead.receivedAt}</span>
                    </div>

                    {/* Service + badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-slate-200">{lead.serviceType}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${URGENCY_COLORS[lead.urgency]}`}>
                        {lead.urgency}
                      </span>
                      {lead.hasInsurance && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          🛡 Insurance
                        </span>
                      )}
                      {lead.insuranceAdjusterVisited && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          ✓ Adjuster Visited
                        </span>
                      )}
                      {lead.wantsInspection && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          🔍 Wants Inspection
                        </span>
                      )}
                      {lead.estimatedBudget !== 'Unknown' && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          💰 {lead.estimatedBudget}
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
                      {lead.status}
                    </span>

                    <div className="flex items-center gap-2">
                      {nextStatus && (
                        <button
                          onClick={() => updateStatus(lead.id, nextStatus)}
                          className="text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                        >
                          → {nextStatus}
                        </button>
                      )}
                      {lead.status !== 'Lost' && lead.status !== 'Won' && (
                        <button
                          onClick={() => updateStatus(lead.id, 'Lost')}
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
                          {lead.purchased ? (
                            <a href={`tel:${lead.phone}`} className="text-sm font-medium text-[#2563EB] hover:text-white transition-colors font-mono">{lead.phone}</a>
                          ) : (
                            <span className="text-sm text-slate-600 italic">🔒 Unlock upon purchase</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600 w-16">Email</span>
                          {lead.purchased ? (
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
                      {!lead.purchased && (
                        <button className="mt-4 w-full text-xs font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2.5 rounded-xl transition-colors">
                          Unlock This Lead — $85
                        </button>
                      )}
                    </div>

                    {/* Qualification data */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Qualification</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Damage cause</span>
                          <span className="text-slate-200">{lead.damageCause}</span>
                        </div>
                        {lead.roofAge && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Roof age</span>
                            <span className="text-slate-200">{lead.roofAge} years</span>
                          </div>
                        )}
                        {lead.roofSizeSqft && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Roof size</span>
                            <span className="text-slate-200">{lead.roofSizeSqft.toLocaleString()} sqft</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Insurance</span>
                          <span className={lead.hasInsurance ? 'text-emerald-400' : 'text-slate-500'}>{lead.hasInsurance ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Adjuster visited</span>
                          <span className={lead.insuranceAdjusterVisited ? 'text-emerald-400' : 'text-slate-500'}>{lead.insuranceAdjusterVisited ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Budget range</span>
                          <span className="text-amber-400 font-medium">{lead.estimatedBudget}</span>
                        </div>
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
                          href={`/dashboard/bids?leadId=${lead.id}&name=${encodeURIComponent(lead.name)}&service=${encodeURIComponent(lead.serviceType)}`}
                          className="flex-1 text-center text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3 py-2 rounded-lg transition-colors"
                        >
                          Create Bid →
                        </a>
                        <button className="flex-1 text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-2 rounded-lg transition-colors">
                          Call Now
                        </button>
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

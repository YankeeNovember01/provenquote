'use client';

import { useState } from 'react';

// Leads that came in from your leased markets on provenquote.com
const LEADS = [
  {
    id: 1,
    date: 'May 19, 2026',
    name: 'James Carter',
    city: 'Austin, TX',
    service: 'Full Roof Replacement',
    description: 'Major hail storm last week. Insurance adjuster already visited and confirmed coverage. Need full replacement ASAP.',
    phone: '(512) 555-0198',
    email: 'jcarter@email.com',
    status: 'New',
    purchased: true,
  },
  {
    id: 2,
    date: 'May 19, 2026',
    name: 'Maria Santos',
    city: 'Austin, TX',
    service: 'Hail Damage Repair',
    description: 'Storm damage to several shingles, possible leak forming. Want inspection and estimate. Insurance not yet filed.',
    phone: '(512) 555-0134',
    email: 'msantos@gmail.com',
    status: 'New',
    purchased: true,
  },
  {
    id: 3,
    date: 'May 18, 2026',
    name: 'Derek Williams',
    city: 'Austin, TX',
    service: 'Roof Repair',
    description: 'Noticed a leak in the master bedroom after the last rain. Looking for inspection and repair quote.',
    phone: null,
    email: null,
    status: 'New',
    purchased: false,
  },
  {
    id: 4,
    date: 'May 18, 2026',
    name: 'Tom Bradley',
    city: 'Austin, TX',
    service: 'Full Roof Replacement',
    description: 'Insurance approved my claim after the May storm. Adjuster gave me $18,500. Looking for bids to get work done by end of month.',
    phone: '(512) 555-0183',
    email: 'tombradley@gmail.com',
    status: 'Contacted',
    purchased: true,
  },
  {
    id: 5,
    date: 'May 17, 2026',
    name: 'Linda Park',
    city: 'Austin, TX',
    service: 'Roof Inspection',
    description: 'Just bought the home and want a full inspection before winter. No known issues.',
    phone: null,
    email: null,
    status: 'New',
    purchased: false,
  },
];

const STATUSES = ['All', 'New', 'Contacted', 'Won', 'Lost'];

export default function LeadsPage() {
  const [filter, setFilter] = useState('All');
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [statuses, setStatuses] = useState<Record<number, string>>({});
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = LEADS.filter(l => filter === 'All' || (statuses[l.id] ?? l.status) === filter);

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
          const currentStatus = statuses[lead.id] ?? lead.status;
          const isExpanded = expanded === lead.id;

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
                    <p className="text-sm font-semibold text-white">{lead.name}</p>
                    <span className="text-xs text-slate-500">{lead.city}</span>
                    <span className="text-xs text-slate-600">{lead.date}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{lead.service}</p>
                </div>

                <div className="flex items-center gap-3">
                  {!lead.purchased && (
                    <span className="text-xs text-slate-500 italic">Contact locked</span>
                  )}
                  <select
                    value={currentStatus}
                    onChange={e => {
                      e.stopPropagation();
                      setStatuses(prev => ({ ...prev, [lead.id]: e.target.value }));
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
                      <p className="text-sm text-slate-300 leading-relaxed mb-5">{lead.description}</p>

                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Your notes</h4>
                      <textarea
                        value={notes[lead.id] ?? ''}
                        onChange={e => setNotes(prev => ({ ...prev, [lead.id]: e.target.value }))}
                        placeholder="Add notes..."
                        className="w-full bg-[#1A2342] border border-white/10 text-white rounded-xl px-4 py-3 text-sm resize-none h-20 placeholder-slate-600 focus:outline-none focus:border-[#2563EB]/40"
                      />
                    </div>

                    {/* Right: contact */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Contact</h4>
                      {lead.purchased ? (
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-slate-600 mb-1">Phone</p>
                            <a href={`tel:${lead.phone}`} className="text-sm font-medium text-[#2563EB]">{lead.phone}</a>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600 mb-1">Email</p>
                            <a href={`mailto:${lead.email}`} className="text-sm text-[#2563EB]">{lead.email}</a>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <a
                              href={`tel:${lead.phone}`}
                              className="flex-1 text-center text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3 py-2.5 rounded-xl transition-colors"
                            >
                              Call Now
                            </a>
                            <a
                              href={`mailto:${lead.email}`}
                              className="flex-1 text-center text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-2.5 rounded-xl transition-colors"
                            >
                              Send Email
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-[#1A2342] border border-white/[0.08] rounded-xl p-5 text-center">
                          <p className="text-sm text-slate-400 mb-1">Contact info locked</p>
                          <p className="text-xs text-slate-600 mb-4">Purchase this lead to unlock phone and email</p>
                          <button className="w-full text-xs font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2.5 rounded-lg transition-colors">
                            Unlock Lead — $85
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
          <p className="text-slate-500">No leads in this status.</p>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { NICHES } from '@/lib/niches';

const AVAILABLE_LEADS = [
  { id: 1, niche: 'Roofing', nicheSlug: 'roofing', city: 'Frisco', state: 'TX', zip: '75034', submitted: '2 hours ago', service: 'Hail Damage Repair', message: 'Had hail damage last week, need inspection and estimate for repair or replacement...', price: 85 },
  { id: 2, niche: 'Landscaping', nicheSlug: 'landscaping', city: 'Boulder', state: 'CO', zip: '80301', submitted: '4 hours ago', service: 'Full Landscaping Design', message: 'Looking to redo my entire backyard — need design, hardscape, plants, irrigation...', price: 45 },
  { id: 3, niche: 'HVAC', nicheSlug: 'hvac', city: 'Scottsdale', state: 'AZ', zip: '85251', submitted: '6 hours ago', service: 'AC System Replacement', message: 'My AC is 15 years old and not cooling properly. Want quotes for replacement...', price: 65 },
  { id: 4, niche: 'Plumbing', nicheSlug: 'plumbing', city: 'Frisco', state: 'TX', zip: '75033', submitted: '8 hours ago', service: 'Water Heater Installation', message: 'Need to replace old water heater, interested in tankless options...', price: 55 },
  { id: 5, niche: 'Solar', nicheSlug: 'solar', city: 'Tempe', state: 'AZ', zip: '85281', submitted: '12 hours ago', service: 'New Solar Install', message: 'Want to go solar, 2,200 sqft home, monthly bill is $280. Need full assessment...', price: 120 },
  { id: 6, niche: 'Electrical', nicheSlug: 'electrical', city: 'Brentwood', state: 'TN', zip: '37027', submitted: '1 day ago', service: 'Panel Upgrade', message: 'Have a 100 amp panel and want to upgrade to 200 amp for EV charger...', price: 50 },
];

const MY_LEADS = [
  { date: 'May 6', niche: 'Roofing', city: 'Austin, TX', name: 'James Carter', phone: '(512) 555-0198', email: 'jcarter@email.com', service: 'Full replacement', status: 'New' },
  { date: 'May 6', niche: 'HVAC', city: 'Phoenix, AZ', name: 'Maria Santos', phone: '(602) 555-0134', email: 'msantos@gmail.com', service: 'AC repair', status: 'Contacted' },
  { date: 'May 5', niche: 'Roofing', city: 'Austin, TX', name: 'Derek Williams', phone: '(512) 555-0276', email: 'derek.w@email.com', service: 'Hail damage', status: 'Quoted' },
  { date: 'May 5', niche: 'Solar', city: 'Denver, CO', name: 'Linda Park', phone: '(303) 555-0091', email: 'linda.park@gmail.com', service: 'New install', status: 'Closed' },
  { date: 'May 4', niche: 'HVAC', city: 'Phoenix, AZ', name: 'Tom Bradley', phone: '(602) 555-0183', email: 'tombradley@gmail.com', service: 'System tune-up', status: 'New' },
  { date: 'May 4', niche: 'Roofing', city: 'Austin, TX', name: 'Sarah Kim', phone: '(512) 555-0312', email: 'skim@email.com', service: 'Inspection', status: 'Contacted' },
  { date: 'May 3', niche: 'Solar', city: 'Denver, CO', name: 'Paul Rivera', phone: '(303) 555-0055', email: 'priv@gmail.com', service: 'New install', status: 'Quoted' },
  { date: 'May 3', niche: 'HVAC', city: 'Phoenix, AZ', name: 'Ana Torres', phone: '(602) 555-0228', email: 'atorres@email.com', service: 'Installation', status: 'Closed' },
  { date: 'May 2', niche: 'Roofing', city: 'Austin, TX', name: 'Mike Johnson', phone: '(512) 555-0409', email: 'mike.j@email.com', service: 'Repair', status: 'Lost' },
  { date: 'May 2', niche: 'Solar', city: 'Denver, CO', name: 'Rachel Green', phone: '(303) 555-0177', email: 'rgreen@gmail.com', service: 'New install', status: 'New' },
];

const STATUS_COLORS: Record<string, string> = {
  New: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  Contacted: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  Quoted: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  Closed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  Lost: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

export default function LeadsPage() {
  const [tab, setTab] = useState<'available' | 'mine'>('available');
  const [filterNiche, setFilterNiche] = useState('');
  const [leadStatuses, setLeadStatuses] = useState<Record<number, string>>({});

  const filteredLeads = AVAILABLE_LEADS.filter(l => {
    if (filterNiche && l.nicheSlug !== filterNiche) return false;
    return true;
  });

  const updateStatus = (i: number, status: string) => {
    setLeadStatuses(prev => ({ ...prev, [i]: status }));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Leads</h1>
        {tab === 'mine' && (
          <button className="text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg transition-colors">
            Export CSV
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-[#0F1729] border border-white/[0.08] rounded-xl p-1 w-fit">
        {(['available', 'mine'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? 'bg-[#1A2342] text-white' : 'text-slate-500 hover:text-white'
            }`}
          >
            {t === 'available' ? 'Available Leads' : 'My Leads'}
          </button>
        ))}
      </div>

      {tab === 'available' && (
        <>
          <div className="flex gap-4 mb-6">
            <select
              value={filterNiche}
              onChange={e => setFilterNiche(e.target.value)}
              className="bg-[#1A2342] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm"
            >
              <option value="">All Niches</option>
              {NICHES.map(n => (
                <option key={n.slug} value={n.slug}>{n.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {filteredLeads.map(lead => (
              <div key={lead.id} className="bg-[#0F1729] border border-white/[0.08] hover:border-white/[0.16] rounded-2xl p-6 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-base font-semibold text-white">{lead.niche} Lead — {lead.city}, {lead.state}</p>
                      <span className="text-xs text-slate-500">{lead.submitted}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-300 mb-1">Service: {lead.service}</p>
                    <p className="text-sm text-slate-500 mb-3 leading-relaxed">&ldquo;{lead.message}&rdquo;</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>ZIP: {lead.zip}</span>
                      <span className="text-slate-700">|</span>
                      <span className="blur-sm select-none text-slate-400">Phone: (555) 000-0000</span>
                      <span className="text-slate-700">|</span>
                      <span className="blur-sm select-none text-slate-400">john.doe@email.com</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-2xl font-bold text-white mb-3">${lead.price}</p>
                    <button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap">
                      Buy Lead
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'mine' && (
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1A2342] border-b border-white/[0.08]">
                  {['Date', 'Niche', 'City', 'Name', 'Phone', 'Email', 'Service', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MY_LEADS.map((lead, i) => {
                  const status = leadStatuses[i] ?? lead.status;
                  return (
                    <tr key={i} className="hover:bg-white/5 transition-colors border-b border-white/[0.04] last:border-0">
                      <td className="px-5 py-3.5 text-sm text-slate-500 whitespace-nowrap">{lead.date}</td>
                      <td className="px-5 py-3.5 text-sm font-medium text-white whitespace-nowrap">{lead.niche}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-300 whitespace-nowrap">{lead.city}</td>
                      <td className="px-5 py-3.5 text-sm text-white whitespace-nowrap">{lead.name}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-400 font-mono whitespace-nowrap">{lead.phone}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-400 whitespace-nowrap">{lead.email}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-400 whitespace-nowrap">{lead.service}</td>
                      <td className="px-5 py-3.5">
                        <select
                          value={status}
                          onChange={e => updateStatus(i, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[status] ?? ''} bg-transparent cursor-pointer`}
                        >
                          {['New', 'Contacted', 'Quoted', 'Closed', 'Lost'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

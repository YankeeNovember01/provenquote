'use client';

import { useState } from 'react';
import { NICHES } from '@/lib/niches';

interface MarketRow {
  niche: string;
  nicheSlug: string;
  city: string;
  state: string;
  traffic: number;
  estLeads: number;
  leasePrice: number;
  leadPrice: number;
  status: 'Available' | 'Leased' | 'High Demand';
}

const MARKET_DATA: MarketRow[] = [
  { niche: 'Roofing', nicheSlug: 'roofing', city: 'Austin', state: 'TX', traffic: 4800, estLeads: 38, leasePrice: 2400, leadPrice: 85, status: 'Available' },
  { niche: 'Roofing', nicheSlug: 'roofing', city: 'Tampa', state: 'FL', traffic: 5100, estLeads: 41, leasePrice: 2400, leadPrice: 85, status: 'Leased' },
  { niche: 'Roofing', nicheSlug: 'roofing', city: 'Kansas City', state: 'MO', traffic: 3900, estLeads: 34, leasePrice: 2400, leadPrice: 85, status: 'Available' },
  { niche: 'Roofing', nicheSlug: 'roofing', city: 'Dallas', state: 'TX', traffic: 7200, estLeads: 56, leasePrice: 3600, leadPrice: 85, status: 'High Demand' },
  { niche: 'HVAC', nicheSlug: 'hvac', city: 'Phoenix', state: 'AZ', traffic: 6200, estLeads: 52, leasePrice: 1800, leadPrice: 65, status: 'Available' },
  { niche: 'HVAC', nicheSlug: 'hvac', city: 'Atlanta', state: 'GA', traffic: 5800, estLeads: 48, leasePrice: 1800, leadPrice: 65, status: 'Available' },
  { niche: 'HVAC', nicheSlug: 'hvac', city: 'Las Vegas', state: 'NV', traffic: 4900, estLeads: 44, leasePrice: 1800, leadPrice: 65, status: 'Leased' },
  { niche: 'Plumbing', nicheSlug: 'plumbing', city: 'Dallas', state: 'TX', traffic: 5300, estLeads: 44, leasePrice: 1600, leadPrice: 55, status: 'Leased' },
  { niche: 'Plumbing', nicheSlug: 'plumbing', city: 'Chicago', state: 'IL', traffic: 8100, estLeads: 57, leasePrice: 2400, leadPrice: 55, status: 'Leased' },
  { niche: 'Plumbing', nicheSlug: 'plumbing', city: 'Denver', state: 'CO', traffic: 3600, estLeads: 30, leasePrice: 1600, leadPrice: 55, status: 'Available' },
  { niche: 'Landscaping', nicheSlug: 'landscaping', city: 'Denver', state: 'CO', traffic: 3400, estLeads: 29, leasePrice: 1200, leadPrice: 45, status: 'Available' },
  { niche: 'Landscaping', nicheSlug: 'landscaping', city: 'Seattle', state: 'WA', traffic: 2900, estLeads: 25, leasePrice: 1200, leadPrice: 45, status: 'Available' },
  { niche: 'Solar', nicheSlug: 'solar', city: 'San Diego', state: 'CA', traffic: 7500, estLeads: 61, leasePrice: 3200, leadPrice: 120, status: 'Available' },
  { niche: 'Solar', nicheSlug: 'solar', city: 'Sacramento', state: 'CA', traffic: 6700, estLeads: 55, leasePrice: 3200, leadPrice: 120, status: 'Leased' },
  { niche: 'Solar', nicheSlug: 'solar', city: 'Denver', state: 'CO', traffic: 4100, estLeads: 33, leasePrice: 3200, leadPrice: 120, status: 'High Demand' },
  { niche: 'Electrical', nicheSlug: 'electrical', city: 'Nashville', state: 'TN', traffic: 3900, estLeads: 33, leasePrice: 1400, leadPrice: 50, status: 'Leased' },
  { niche: 'Electrical', nicheSlug: 'electrical', city: 'Portland', state: 'OR', traffic: 3200, estLeads: 27, leasePrice: 1400, leadPrice: 50, status: 'Available' },
  { niche: 'Painting', nicheSlug: 'painting', city: 'Portland', state: 'OR', traffic: 2600, estLeads: 22, leasePrice: 900, leadPrice: 35, status: 'Available' },
  { niche: 'Painting', nicheSlug: 'painting', city: 'Minneapolis', state: 'MN', traffic: 2100, estLeads: 18, leasePrice: 900, leadPrice: 35, status: 'Available' },
  { niche: 'Fencing', nicheSlug: 'fencing', city: 'Charlotte', state: 'NC', traffic: 2200, estLeads: 18, leasePrice: 800, leadPrice: 30, status: 'Available' },
  { niche: 'Gutters', nicheSlug: 'gutters', city: 'Columbus', state: 'OH', traffic: 1900, estLeads: 16, leasePrice: 700, leadPrice: 28, status: 'Available' },
  { niche: 'Concrete & Driveways', nicheSlug: 'concrete', city: 'Indianapolis', state: 'IN', traffic: 2800, estLeads: 24, leasePrice: 1000, leadPrice: 40, status: 'Available' },
  { niche: 'Pest Control', nicheSlug: 'pest-control', city: 'Orlando', state: 'FL', traffic: 3700, estLeads: 31, leasePrice: 600, leadPrice: 22, status: 'Available' },
  { niche: 'Cleaning', nicheSlug: 'cleaning', city: 'Seattle', state: 'WA', traffic: 3200, estLeads: 27, leasePrice: 500, leadPrice: 18, status: 'Leased' },
  { niche: 'Windows & Doors', nicheSlug: 'windows', city: 'Minneapolis', state: 'MN', traffic: 2500, estLeads: 21, leasePrice: 1100, leadPrice: 42, status: 'Available' },
  { niche: 'Flooring', nicheSlug: 'flooring', city: 'San Antonio', state: 'TX', traffic: 3000, estLeads: 26, leasePrice: 950, leadPrice: 38, status: 'Available' },
  { niche: 'Garage Doors', nicheSlug: 'garage-doors', city: 'Las Vegas', state: 'NV', traffic: 2300, estLeads: 19, leasePrice: 750, leadPrice: 30, status: 'Available' },
  { niche: 'HVAC', nicheSlug: 'hvac', city: 'Charlotte', state: 'NC', traffic: 4200, estLeads: 36, leasePrice: 1800, leadPrice: 65, status: 'High Demand' },
  { niche: 'Roofing', nicheSlug: 'roofing', city: 'Nashville', state: 'TN', traffic: 3600, estLeads: 30, leasePrice: 2400, leadPrice: 85, status: 'Available' },
  { niche: 'Solar', nicheSlug: 'solar', city: 'Austin', state: 'TX', traffic: 5500, estLeads: 45, leasePrice: 3200, leadPrice: 120, status: 'Available' },
  { niche: 'Plumbing', nicheSlug: 'plumbing', city: 'Orlando', state: 'FL', traffic: 4100, estLeads: 35, leasePrice: 1600, leadPrice: 55, status: 'Available' },
  { niche: 'Landscaping', nicheSlug: 'landscaping', city: 'Austin', state: 'TX', traffic: 2800, estLeads: 24, leasePrice: 1200, leadPrice: 45, status: 'Leased' },
  { niche: 'Electrical', nicheSlug: 'electrical', city: 'San Antonio', state: 'TX', traffic: 2900, estLeads: 25, leasePrice: 1400, leadPrice: 50, status: 'Available' },
  { niche: 'Fencing', nicheSlug: 'fencing', city: 'Phoenix', state: 'AZ', traffic: 2600, estLeads: 22, leasePrice: 800, leadPrice: 30, status: 'Available' },
  { niche: 'Pest Control', nicheSlug: 'pest-control', city: 'Houston', state: 'TX', traffic: 4800, estLeads: 40, leasePrice: 900, leadPrice: 22, status: 'High Demand' },
  { niche: 'Gutters', nicheSlug: 'gutters', city: 'Indianapolis', state: 'IN', traffic: 1700, estLeads: 14, leasePrice: 700, leadPrice: 28, status: 'Available' },
  { niche: 'Flooring', nicheSlug: 'flooring', city: 'Nashville', state: 'TN', traffic: 2400, estLeads: 20, leasePrice: 950, leadPrice: 38, status: 'Available' },
  { niche: 'Painting', nicheSlug: 'painting', city: 'Denver', state: 'CO', traffic: 2200, estLeads: 19, leasePrice: 900, leadPrice: 35, status: 'Available' },
  { niche: 'Concrete & Driveways', nicheSlug: 'concrete', city: 'Phoenix', state: 'AZ', traffic: 3100, estLeads: 26, leasePrice: 1000, leadPrice: 40, status: 'Leased' },
  { niche: 'Windows & Doors', nicheSlug: 'windows', city: 'Denver', state: 'CO', traffic: 2100, estLeads: 18, leasePrice: 1100, leadPrice: 42, status: 'Available' },
  { niche: 'Garage Doors', nicheSlug: 'garage-doors', city: 'Denver', state: 'CO', traffic: 1900, estLeads: 16, leasePrice: 750, leadPrice: 30, status: 'Available' },
  { niche: 'HVAC', nicheSlug: 'hvac', city: 'Denver', state: 'CO', traffic: 4600, estLeads: 39, leasePrice: 1800, leadPrice: 65, status: 'Available' },
  { niche: 'Roofing', nicheSlug: 'roofing', city: 'Denver', state: 'CO', traffic: 4100, estLeads: 35, leasePrice: 2400, leadPrice: 85, status: 'Available' },
  { niche: 'Solar', nicheSlug: 'solar', city: 'Las Vegas', state: 'NV', traffic: 5800, estLeads: 48, leasePrice: 3200, leadPrice: 120, status: 'Leased' },
  { niche: 'Cleaning', nicheSlug: 'cleaning', city: 'Portland', state: 'OR', traffic: 2700, estLeads: 23, leasePrice: 500, leadPrice: 18, status: 'Available' },
  { niche: 'Landscaping', nicheSlug: 'landscaping', city: 'Charlotte', state: 'NC', traffic: 2400, estLeads: 20, leasePrice: 1200, leadPrice: 45, status: 'Available' },
  { niche: 'Electrical', nicheSlug: 'electrical', city: 'Columbus', state: 'OH', traffic: 2600, estLeads: 22, leasePrice: 1400, leadPrice: 50, status: 'Available' },
  { niche: 'Plumbing', nicheSlug: 'plumbing', city: 'Nashville', state: 'TN', traffic: 3500, estLeads: 29, leasePrice: 1600, leadPrice: 55, status: 'Available' },
  { niche: 'Roofing', nicheSlug: 'roofing', city: 'Minneapolis', state: 'MN', traffic: 3400, estLeads: 29, leasePrice: 2400, leadPrice: 85, status: 'Available' },
  { niche: 'HVAC', nicheSlug: 'hvac', city: 'Indianapolis', state: 'IN', traffic: 3800, estLeads: 32, leasePrice: 1800, leadPrice: 65, status: 'Available' },
];

const STATUS_STYLE: Record<string, string> = {
  Available: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  Leased: 'bg-red-500/10 text-red-400 border border-red-500/20',
  'High Demand': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
};

const ALL_STATES = [...new Set(MARKET_DATA.map(m => m.state))].sort();

export default function DashboardMarketsPage() {
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'estLeads' | 'leasePrice' | 'traffic'>('estLeads');
  const [leasingId, setLeasingId] = useState<string | null>(null);

  const toggleNiche = (slug: string) => {
    setSelectedNiches(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const handleLease = async (market: MarketRow) => {
    const key = `${market.niche}-${market.city}-${market.state}`;
    setLeasingId(key);
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lease',
          niche: market.niche,
          city: market.city,
          state: market.state,
          leasePrice: market.leasePrice,
        }),
      });
      const { url, error } = await res.json();
      if (error) {
        alert('Error: ' + error);
      } else if (url) {
        window.location.href = url;
      }
    } catch {
      alert('Something went wrong. Please try again.');
    }
    setLeasingId(null);
  };

  const filtered = MARKET_DATA.filter(m => {
    if (selectedNiches.length > 0 && !selectedNiches.includes(m.nicheSlug)) return false;
    if (selectedState && m.state !== selectedState) return false;
    if (statusFilter !== 'All' && m.status !== statusFilter) return false;
    return true;
  }).sort((a, b) => b[sortBy] - a[sortBy]);

  const available = filtered.filter(m => m.status === 'Available').length;
  const states = new Set(filtered.map(m => m.state)).size;
  const niches = new Set(filtered.map(m => m.nicheSlug)).size;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Lease a Market</h1>
      </div>

      <div className="flex gap-6">
        {/* Left filters sidebar */}
        <div className="w-56 shrink-0">
          <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Niche</h3>
            <div className="space-y-2 mb-6">
              {NICHES.map(n => (
                <label key={n.slug} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedNiches.includes(n.slug)}
                    onChange={() => toggleNiche(n.slug)}
                    className="rounded border-white/20 bg-[#1A2342] text-[#2563EB]"
                  />
                  <span className="text-xs text-slate-400 group-hover:text-white transition-colors">{n.name}</span>
                </label>
              ))}
            </div>

            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">State</h3>
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="w-full bg-[#1A2342] border border-white/10 text-white rounded-lg px-3 py-2 text-xs mb-6"
            >
              <option value="">All States</option>
              {ALL_STATES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Status</h3>
            <div className="space-y-1">
              {['All', 'Available', 'Leased', 'High Demand'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    statusFilter === s ? 'bg-[#2563EB] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {(selectedNiches.length > 0 || selectedState || statusFilter !== 'All') && (
              <button
                onClick={() => { setSelectedNiches([]); setSelectedState(''); setStatusFilter('All'); }}
                className="w-full mt-4 text-xs text-[#2563EB] hover:text-white transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Summary bar */}
          <div className="bg-[#0F1729] border border-white/[0.08] rounded-xl px-5 py-3 mb-4 flex items-center gap-6 text-sm text-slate-400">
            <span><strong className="text-white">{available}</strong> available</span>
            <span><strong className="text-white">{filtered.length}</strong> total shown</span>
            <span><strong className="text-white">{niches}</strong> niches</span>
            <span><strong className="text-white">{states}</strong> states</span>
          </div>

          {/* Table */}
          <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1A2342] border-b border-white/[0.08]">
                    {[
                      { label: 'Niche', key: null },
                      { label: 'City', key: null },
                      { label: 'State', key: null },
                      { label: 'Monthly Traffic', key: 'traffic' },
                      { label: 'Est. Leads/Mo', key: 'estLeads' },
                      { label: 'Lease Price', key: 'leasePrice' },
                      { label: 'Lead Price', key: null },
                      { label: 'Status', key: null },
                      { label: 'Action', key: null },
                    ].map(({ label, key }) => (
                      <th
                        key={label}
                        onClick={() => key && setSortBy(key as typeof sortBy)}
                        className={`text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap ${key ? 'cursor-pointer hover:text-white' : ''} ${sortBy === key ? 'text-white' : ''}`}
                      >
                        {label} {sortBy === key && '↓'}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m, i) => {
                    const leaseKey = `${m.niche}-${m.city}-${m.state}`;
                    const isLeasing = leasingId === leaseKey;
                    return (
                      <tr key={i} className="hover:bg-white/5 transition-colors border-b border-white/[0.04] last:border-0">
                        <td className="px-4 py-3.5 text-sm font-medium text-white whitespace-nowrap">{m.niche}</td>
                        <td className="px-4 py-3.5 text-sm text-slate-300 whitespace-nowrap">{m.city}</td>
                        <td className="px-4 py-3.5 text-sm text-slate-500">{m.state}</td>
                        <td className="px-4 py-3.5 text-sm text-slate-300">{m.traffic.toLocaleString()}</td>
                        <td className="px-4 py-3.5 text-sm font-semibold text-white">{m.estLeads}</td>
                        <td className="px-4 py-3.5 text-sm text-white whitespace-nowrap">${m.leasePrice.toLocaleString()}/mo</td>
                        <td className="px-4 py-3.5 text-sm text-slate-400">${m.leadPrice}</td>
                        <td className="px-4 py-3.5">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_STYLE[m.status]}`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          {m.status !== 'Leased' ? (
                            <button
                              onClick={() => handleLease(m)}
                              disabled={isLeasing}
                              className="text-xs font-semibold text-[#2563EB] hover:text-white disabled:opacity-60 transition-colors whitespace-nowrap"
                            >
                              {isLeasing ? 'Redirecting...' : 'Lease Now'}
                            </button>
                          ) : (
                            <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
                              Taken
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

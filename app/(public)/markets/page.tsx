'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NICHES } from '@/lib/niches';

interface Market {
  niche: string;
  nicheSlug: string;
  city: string;
  state: string;
  estLeads: number;
  price: number;
  available: boolean;
}

const SEED_MARKETS: Market[] = [
  { niche: 'Roofing', nicheSlug: 'roofing', city: 'Austin', state: 'TX', estLeads: 38, price: 2400, available: true },
  { niche: 'HVAC', nicheSlug: 'hvac', city: 'Phoenix', state: 'AZ', estLeads: 52, price: 1800, available: true },
  { niche: 'Plumbing', nicheSlug: 'plumbing', city: 'Dallas', state: 'TX', estLeads: 44, price: 1600, available: false },
  { niche: 'Landscaping', nicheSlug: 'landscaping', city: 'Denver', state: 'CO', estLeads: 29, price: 1200, available: true },
  { niche: 'Solar', nicheSlug: 'solar', city: 'San Diego', state: 'CA', estLeads: 61, price: 3200, available: true },
  { niche: 'Electrical', nicheSlug: 'electrical', city: 'Nashville', state: 'TN', estLeads: 33, price: 1400, available: false },
  { niche: 'Painting', nicheSlug: 'painting', city: 'Portland', state: 'OR', estLeads: 22, price: 900, available: true },
  { niche: 'Roofing', nicheSlug: 'roofing', city: 'Tampa', state: 'FL', estLeads: 41, price: 2400, available: false },
  { niche: 'Fencing', nicheSlug: 'fencing', city: 'Charlotte', state: 'NC', estLeads: 18, price: 800, available: true },
  { niche: 'Gutters', nicheSlug: 'gutters', city: 'Columbus', state: 'OH', estLeads: 16, price: 700, available: true },
  { niche: 'Concrete', nicheSlug: 'concrete', city: 'Indianapolis', state: 'IN', estLeads: 24, price: 1000, available: true },
  { niche: 'Solar', nicheSlug: 'solar', city: 'Sacramento', state: 'CA', estLeads: 55, price: 3200, available: false },
  { niche: 'HVAC', nicheSlug: 'hvac', city: 'Atlanta', state: 'GA', estLeads: 48, price: 1800, available: true },
  { niche: 'Pest Control', nicheSlug: 'pest-control', city: 'Orlando', state: 'FL', estLeads: 31, price: 600, available: true },
  { niche: 'Cleaning', nicheSlug: 'cleaning', city: 'Seattle', state: 'WA', estLeads: 27, price: 500, available: false },
  { niche: 'Windows & Doors', nicheSlug: 'windows', city: 'Minneapolis', state: 'MN', estLeads: 21, price: 1100, available: true },
  { niche: 'Flooring', nicheSlug: 'flooring', city: 'San Antonio', state: 'TX', estLeads: 26, price: 950, available: true },
  { niche: 'Garage Doors', nicheSlug: 'garage-doors', city: 'Las Vegas', state: 'NV', estLeads: 19, price: 750, available: true },
  { niche: 'Plumbing', nicheSlug: 'plumbing', city: 'Chicago', state: 'IL', estLeads: 57, price: 2200, available: false },
  { niche: 'Roofing', nicheSlug: 'roofing', city: 'Kansas City', state: 'MO', estLeads: 34, price: 2400, available: true },
];

const ALL_STATES = [...new Set(SEED_MARKETS.map(m => m.state))].sort();

export default function MarketsPage() {
  const [selectedNiche, setSelectedNiche] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = SEED_MARKETS.filter(m => {
    if (selectedNiche && m.nicheSlug !== selectedNiche) return false;
    if (selectedState && m.state !== selectedState) return false;
    if (statusFilter === 'available' && !m.available) return false;
    if (statusFilter === 'leased' && m.available) return false;
    return true;
  });

  const availableCount = filtered.filter(m => m.available).length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">Available Markets</h1>
        <p className="text-slate-400 text-lg">Browse exclusive niche slots by city. One business per market.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <select
          value={selectedNiche}
          onChange={e => setSelectedNiche(e.target.value)}
          className="bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-2.5 text-sm"
        >
          <option value="">All Niches</option>
          {NICHES.map(n => (
            <option key={n.slug} value={n.slug}>{n.name}</option>
          ))}
        </select>

        <select
          value={selectedState}
          onChange={e => setSelectedState(e.target.value)}
          className="bg-[#1A2342] border border-white/10 text-white placeholder-slate-500 focus:border-[#2563EB] rounded-lg px-4 py-2.5 text-sm"
        >
          <option value="">All States</option>
          {ALL_STATES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div className="flex rounded-lg overflow-hidden border border-white/10">
          {(['all', 'available', 'leased'] as const).map(v => (
            <button
              key={v}
              onClick={() => setStatusFilter(v)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors capitalize ${
                statusFilter === v
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-[#1A2342] text-slate-400 hover:text-white'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Summary bar */}
      <div className="bg-[#0F1729] border border-white/[0.08] rounded-xl px-6 py-4 mb-8 flex items-center gap-2 text-sm text-slate-400">
        <span className="w-2 h-2 bg-[#10B981] rounded-full" />
        <span><strong className="text-white">{availableCount} markets available</strong> out of {filtered.length} shown</span>
      </div>

      {/* Markets grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((m, i) => {
          const cityState = `${m.city.toLowerCase().replace(/ /g, '-')}-${m.state.toLowerCase()}`;
          return (
            <div key={i} className="bg-[#0F1729] border border-white/[0.08] hover:border-white/[0.16] rounded-2xl p-6 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">{m.niche}</p>
                  <h3 className="text-lg font-semibold text-white">{m.city}, {m.state}</h3>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  m.available
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {m.available ? 'Available' : 'Leased'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Est. monthly leads</p>
                  <p className="text-xl font-bold text-white">{m.estLeads}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Monthly lease</p>
                  <p className="text-xl font-bold text-white">${m.price.toLocaleString()}/mo</p>
                </div>
              </div>

              {m.available ? (
                <Link
                  href={`/lease/${m.nicheSlug}/${cityState}`}
                  className="block w-full text-center bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
                >
                  Lease This Market
                </Link>
              ) : (
                <Link
                  href={`/leads/${m.nicheSlug}/${cityState}`}
                  className="block w-full text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
                >
                  Buy Individual Leads
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24 text-slate-500">
          No markets match your filters. Try broadening your search.
        </div>
      )}
    </div>
  );
}

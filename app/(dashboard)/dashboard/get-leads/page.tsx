'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ShoppingCart } from 'lucide-react';

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
  urgency: string | null;
  estimated_budget: string | null;
  has_insurance: boolean | null;
  lead_score: number | null;
  service_type: string | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getUrgencyLabel(urgency: string | null) {
  switch (urgency?.toLowerCase()) {
    case 'emergency': return { label: 'Emergency', cls: 'bg-red-500/15 text-red-400 border-red-500/20' };
    case 'this_week':
    case 'this week': return { label: 'This week', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/20' };
    case 'planning':
    case 'planning_ahead':
    case 'planning ahead': return { label: 'Planning ahead', cls: 'bg-blue-500/15 text-blue-400 border-blue-500/20' };
    default: return null;
  }
}

export default function GetLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLeadId, setLoadingLeadId] = useState<string | null>(null);
  const [nicheFilter, setNicheFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('All');

  useEffect(() => {
    async function fetchLeads() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // Fetch all unassigned leads (available for purchase)
      const { data } = await supabase
        .from('pq_leads')
        .select('*')
        .is('tenant_id', null)
        .neq('is_exclusive', true)
        .neq('status', 'spam')
        .order('created_at', { ascending: false })
        .limit(100);

      setLeads(data ?? []);
      setLoading(false);
    }

    fetchLeads();
  }, []);

  const handleBuyLead = async (lead: Lead) => {
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

  const allNiches = [...new Set(leads.map(l => l.niche).filter(Boolean))].sort() as string[];

  const filtered = leads.filter(l => {
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

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-white mb-4">Get Leads</h1>
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Get Leads</h1>
          <p className="text-slate-400 text-sm mt-1">Browse available leads and purchase contact info instantly.</p>
        </div>
        <span className="text-xs bg-[#0F1729] border border-white/[0.08] text-slate-400 px-3 py-1.5 rounded-lg">
          {leads.length} available
        </span>
      </div>

      {/* Lease a Hub CTA */}
      <div className="bg-[#0F1729] border border-emerald-500/20 rounded-2xl p-6 mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white mb-1">Want every lead in your market automatically?</h2>
          <p className="text-sm text-slate-400">Lease a Hub to lock in your niche + city. All leads come to you exclusively — no per-lead cost.</p>
        </div>
        <Link
          href="/dashboard/markets"
          className="shrink-0 ml-6 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl transition"
        >
          Browse Markets to Lease a Hub
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={nicheFilter}
          onChange={e => setNicheFilter(e.target.value)}
          className="bg-[#0F1729] border border-white/[0.08] text-white rounded-lg px-3 py-1.5 text-xs"
        >
          <option value="">All Niches</option>
          {allNiches.map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>

        <input
          type="text"
          value={locationFilter}
          onChange={e => setLocationFilter(e.target.value)}
          placeholder="Filter by city or state..."
          className="bg-[#0F1729] border border-white/[0.08] text-white rounded-lg px-3 py-1.5 text-xs placeholder-slate-600 focus:outline-none focus:border-[#2563EB]/40 min-w-[180px]"
        />

        <select
          value={urgencyFilter}
          onChange={e => setUrgencyFilter(e.target.value)}
          className="bg-[#0F1729] border border-white/[0.08] text-white rounded-lg px-3 py-1.5 text-xs"
        >
          <option value="All">All Urgencies</option>
          <option value="Emergency">Emergency</option>
          <option value="This week">This week</option>
          <option value="Planning ahead">Planning ahead</option>
        </select>

        {(nicheFilter || locationFilter || urgencyFilter !== 'All') && (
          <button
            onClick={() => {
              setNicheFilter('');
              setLocationFilter('');
              setUrgencyFilter('All');
            }}
            className="text-xs text-slate-500 hover:text-white px-2 py-1.5 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Lead cards */}
      {filtered.length === 0 ? (
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-16 text-center">
          <ShoppingCart className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          {leads.length === 0 ? (
            <>
              <p className="text-slate-400 mb-2">No leads available right now.</p>
              <p className="text-slate-600 text-sm">Check back soon — new leads are posted regularly.</p>
            </>
          ) : (
            <>
              <p className="text-slate-500 mb-1">No leads match your filters.</p>
              <button
                onClick={() => {
                  setNicheFilter('');
                  setLocationFilter('');
                  setUrgencyFilter('All');
                }}
                className="text-xs text-[#2563EB] hover:text-white mt-2 transition-colors"
              >
                Clear all filters
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(lead => {
            const location = [lead.city, lead.state].filter(Boolean).join(', ') || '—';
            const urgencyInfo = getUrgencyLabel(lead.urgency);

            return (
              <div
                key={lead.id}
                className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-5 flex flex-col"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{lead.niche || 'General'}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{location}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {urgencyInfo && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${urgencyInfo.cls}`}>
                        {urgencyInfo.label}
                      </span>
                    )}
                    {lead.has_insurance && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-sky-500/10 text-sky-400 border-sky-500/20">
                        Insurance
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed mb-3 flex-1 line-clamp-3">
                  {lead.description || 'No description provided.'}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between mb-4">
                  {lead.estimated_budget ? (
                    <span className="text-xs text-emerald-400 font-medium">{lead.estimated_budget}</span>
                  ) : (
                    <span className="text-xs text-slate-600">Budget unknown</span>
                  )}
                  <span className="text-xs text-slate-500">{formatDate(lead.created_at)}</span>
                </div>

                {/* Buy button */}
                <button
                  onClick={() => handleBuyLead(lead)}
                  disabled={loadingLeadId === lead.id}
                  className="w-full text-sm font-bold bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white px-4 py-2.5 rounded-xl transition-colors"
                >
                  {loadingLeadId === lead.id ? 'Redirecting...' : `Buy Lead — $${lead.lead_price ?? 85}`}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

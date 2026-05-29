'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  business: any;
  leases: any[];
  leads: any[];
  newLeads: any[];
  monthlySpend: number;
  isPro?: boolean;
}

export default function DashboardHomeClient({ business, leases, leads, newLeads, monthlySpend, isPro = false }: Props) {
  const searchParams = useSearchParams();
  const justOnboarded = searchParams.get('onboarded') === '1';

  // Build 30-day chart from real lead data
  const chartData = (() => {
    const days: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      days[key] = 0;
    }
    leads.forEach(l => {
      const key = new Date(l.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (key in days) days[key]++;
    });
    return Object.entries(days).map(([day, count]) => ({ day, leads: count }));
  })();

  const firstName = business.business_name?.split(' ')[0] ?? 'there';

  return (
    <div className="p-8">
      {/* Welcome banner shown right after first-time setup */}
      {justOnboarded && (
        <div className="mb-6 flex items-center gap-4 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-2xl px-6 py-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">You're all set! Welcome to ProvenQuote.</p>
            <p className="text-xs text-slate-400 mt-0.5">Here are leads matching your profile. Lease a market to start receiving them directly.</p>
          </div>
          <Link
            href="/dashboard/markets"
            className="flex-shrink-0 text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg transition-colors"
          >
            Explore Markets →
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome, {firstName}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {newLeads.length > 0
              ? `You have ${newLeads.length} new lead${newLeads.length > 1 ? 's' : ''} waiting.`
              : 'Everything is up to date.'}
          </p>
        </div>
        <p className="text-sm text-slate-500">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className={`bg-[#0F1729] border rounded-2xl p-6 ${newLeads.length > 0 ? 'border-[#2563EB]/30' : 'border-white/[0.08]'}`}>
          <p className="text-xs text-slate-500 mb-2">New Leads</p>
          <p className={`text-3xl font-bold mb-1 ${newLeads.length > 0 ? 'text-[#2563EB]' : 'text-white'}`}>{newLeads.length}</p>
          <p className="text-xs text-slate-500">Waiting for response</p>
        </div>
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
          <p className="text-xs text-slate-500 mb-2">Leads This Month</p>
          <p className="text-3xl font-bold text-white mb-1">{leads.length}</p>
          <p className="text-xs text-slate-500">Across all markets</p>
        </div>
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
          <p className="text-xs text-slate-500 mb-2">Active Leases</p>
          <p className="text-3xl font-bold text-white mb-1">{leases.length}</p>
          <p className="text-xs text-slate-500">City markets</p>
        </div>
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
          <p className="text-xs text-slate-500 mb-2">Monthly Spend</p>
          <p className="text-3xl font-bold text-white mb-1">${monthlySpend.toLocaleString()}</p>
          <p className="text-xs text-slate-500">{leases.length} active lease{leases.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* New leads action panel */}
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white">New Leads</h2>
            <Link href="/dashboard/leads" className="text-xs text-[#2563EB] hover:text-white transition-colors">View all</Link>
          </div>

          {newLeads.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 text-sm">No new leads right now.</p>
              <Link href="/dashboard/markets" className="text-xs text-[#2563EB] mt-2 block hover:text-white transition-colors">
                Lease more markets to get leads
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {newLeads.slice(0, 4).map((lead: any) => (
                <Link
                  key={lead.id}
                  href="/dashboard/leads"
                  className="flex items-start gap-3 p-3 rounded-xl bg-[#1A2342] hover:bg-[#1E2A4A] transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white group-hover:text-[#2563EB] transition-colors">{lead.homeowner_name}</p>
                    <p className="text-xs text-slate-500 truncate">{lead.service_type} · {lead.city}, {lead.state}</p>
                  </div>
                  <span className="text-slate-600 group-hover:text-[#2563EB] transition-colors text-sm">›</span>
                </Link>
              ))}
            </div>
          )}

          <Link
            href="/dashboard/leads"
            className="mt-4 w-full flex items-center justify-center bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
          >
            Open Lead Inbox
          </Link>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-6">Leads — Last 30 Days</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#1A2342', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#F8FAFC', fontSize: 12 }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <Bar dataKey="leads" fill="#2563EB" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Pipeline Insights — PRO */}
      <div className="mb-6">
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">AI Pipeline Insights</h2>
              {!isPro && (
                <span className="text-[9px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-full px-2 py-0.5 uppercase tracking-wide">PRO</span>
              )}
            </div>
            {isPro && <span className="text-xs text-emerald-400">● Live</span>}
          </div>
          {isPro ? (
            <p className="text-sm text-slate-400">Pipeline analytics will appear here as your data grows.</p>
          ) : (
            <div className="relative">
              {/* Blurred preview */}
              <div className="blur-sm pointer-events-none select-none opacity-50">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  {[
                    { label: 'Close rate', value: '67%' },
                    { label: 'Win rate', value: '43%' },
                    { label: 'Avg deal size', value: '$8,400' },
                    { label: 'Pipeline value', value: '$61,200' },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-white/5 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-white">{value}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="h-24 bg-white/5 rounded-lg" />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center bg-[#0F1729]/90 px-6 py-4 rounded-2xl border border-blue-500/20">
                  <p className="text-sm font-semibold text-white mb-1">Pro Feature</p>
                  <p className="text-xs text-slate-400 mb-3">Unlock AI-powered close rates, pipeline value, and win analytics.</p>
                  <Link href="/dashboard/upgrade" className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-block transition-colors font-medium">
                    Unlock Insights →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Leases + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white">Active Leases</h2>
            <Link href="/dashboard/markets" className="text-xs text-[#2563EB] hover:text-white transition-colors">Add market</Link>
          </div>
          {leases.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 text-sm mb-3">No active leases yet.</p>
              <Link
                href="/dashboard/markets"
                className="text-sm font-semibold text-[#2563EB] hover:text-white transition-colors"
              >
                Browse markets to get started
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {leases.map((lease: any) => (
                <div key={lease.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-white">{lease.niche} — {lease.city}, {lease.state}</p>
                    <p className="text-xs text-slate-500 mt-0.5">${lease.monthly_cost?.toLocaleString()}/mo</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-5">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: 'View Leads', sub: `${newLeads.length} new`, href: '/dashboard/leads', primary: newLeads.length > 0 },
              { label: 'Lease a Market', sub: 'Find new cities', href: '/dashboard/markets', primary: false },
              { label: 'Business Profile', sub: 'Update listing', href: '/dashboard/profile', primary: false },
              { label: 'Messages', sub: 'Customer conversations', href: '/dashboard/messages', primary: false },
            ].map(({ label, sub, href, primary }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${
                  primary
                    ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
                    : 'bg-[#1A2342] hover:bg-[#1E2A4A] border border-white/[0.06] text-white'
                }`}
              >
                <div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className={`text-xs mt-0.5 ${primary ? 'text-blue-200' : 'text-slate-400'}`}>{sub}</p>
                </div>
                <span className={primary ? 'text-blue-200' : 'text-slate-600'}>›</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

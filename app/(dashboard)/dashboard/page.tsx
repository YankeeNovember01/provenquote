'use client';

import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const STAT_CARDS = [
  { label: 'Active Leases', value: '3', change: '+1 this month', positive: true },
  { label: 'New Leads', value: '3', change: 'Waiting for your response', positive: null, urgent: true },
  { label: 'Leads This Month', value: '84', change: '+12% vs last month', positive: true },
  { label: 'Monthly Spend', value: '$6,800', change: '3 active leases', positive: null },
];

const ACTIVE_LEASES = [
  { niche: 'Roofing', city: 'Austin, TX', cost: 2400, nextBilling: 'Jun 1', leadsThisMonth: 34, leadsLastMonth: 28 },
  { niche: 'HVAC', city: 'Phoenix, AZ', cost: 1800, nextBilling: 'Jun 3', leadsThisMonth: 31, leadsLastMonth: 30 },
  { niche: 'Solar', city: 'Denver, CO', cost: 2600, nextBilling: 'Jun 8', leadsThisMonth: 19, leadsLastMonth: 22 },
];

const ACTION_ITEMS = [
  { icon: '🔴', label: 'James Carter', sub: 'Full Roof Replacement · Austin, TX · Score 98', href: '/dashboard/leads', urgency: 'Critical' },
  { icon: '🟠', label: 'Maria Santos', sub: 'Hail Damage Repair · Austin, TX · Score 82', href: '/dashboard/leads', urgency: 'High' },
  { icon: '🟠', label: 'Tom Bradley', sub: 'Full Roof Replacement · Austin, TX · Score 94', href: '/dashboard/leads', urgency: 'High' },
];

const CHART_DATA = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    leads: Math.floor(Math.random() * 6) + 1,
  };
});

const QUICK_ACTIONS = [
  { label: 'View Lead Inbox', sub: '3 new leads', href: '/dashboard/leads', color: 'bg-[#2563EB]' },
  { label: 'Browse Markets', sub: 'Find new hubs', href: '/dashboard/markets', color: 'bg-[#1A2342] border border-white/10' },
  { label: 'Business Profile', sub: 'Update your listing', href: '/dashboard/profile', color: 'bg-[#1A2342] border border-white/10' },
];

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Good morning, Apex Roofing</h1>
          <p className="text-sm text-slate-500 mt-1">Here&apos;s what needs your attention today.</p>
        </div>
        <p className="text-sm text-slate-500">May 2026</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map(({ label, value, change, positive, urgent }) => (
          <div key={label} className={`bg-[#0F1729] border rounded-2xl p-6 ${urgent ? 'border-[#2563EB]/30' : 'border-white/[0.08]'}`}>
            <p className="text-xs text-slate-500 mb-2">{label}</p>
            <p className={`text-3xl font-bold mb-1 ${urgent ? 'text-[#2563EB]' : 'text-white'}`}>{value}</p>
            <p className={`text-xs ${positive === true ? 'text-[#10B981]' : positive === false ? 'text-[#EF4444]' : 'text-slate-500'}`}>
              {change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Action items */}
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white">New Leads — Respond Now</h2>
            <Link href="/dashboard/leads" className="text-xs text-[#2563EB] hover:text-white transition-colors">View all →</Link>
          </div>
          <div className="space-y-3">
            {ACTION_ITEMS.map((item, i) => (
              <Link key={i} href={item.href} className="flex items-start gap-3 p-3 rounded-xl bg-[#1A2342] hover:bg-[#1E2A4A] transition-colors group">
                <span className="text-base mt-0.5">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white group-hover:text-[#2563EB] transition-colors">{item.label}</p>
                  <p className="text-xs text-slate-500 truncate">{item.sub}</p>
                </div>
                <span className="text-slate-600 group-hover:text-[#2563EB] transition-colors text-sm">→</span>
              </Link>
            ))}
          </div>
          <Link
            href="/dashboard/leads"
            className="mt-4 w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
          >
            Open Lead Inbox
          </Link>
        </div>

        {/* Leads chart */}
        <div className="lg:col-span-2 bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-6">Leads — Last 30 Days</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={CHART_DATA} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: '#475569' }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
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

      {/* Active Leases + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active leases */}
        <div className="lg:col-span-2 bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white">Active Leases</h2>
            <Link href="/dashboard/leases" className="text-xs text-[#2563EB] hover:text-white transition-colors">Manage →</Link>
          </div>
          <div className="space-y-3">
            {ACTIVE_LEASES.map(lease => {
              const trend = lease.leadsThisMonth - lease.leadsLastMonth;
              const trendUp = trend >= 0;
              return (
                <div key={`${lease.niche}-${lease.city}`} className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-white">{lease.niche} — {lease.city}</p>
                    <p className="text-xs text-slate-500 mt-0.5">${lease.cost.toLocaleString()}/mo · Renews {lease.nextBilling}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{lease.leadsThisMonth} leads</p>
                    <p className={`text-xs font-semibold ${trendUp ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                      {trendUp ? '+' : ''}{trend} vs last mo
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <p className="text-xs text-slate-500">Total monthly</p>
            <p className="text-lg font-bold text-white">$6,800/mo</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-5">Quick Actions</h2>
          <div className="space-y-3">
            {QUICK_ACTIONS.map(({ label, sub, href, color }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-white font-medium text-sm transition-all hover:opacity-90 ${color}`}
              >
                <div>
                  <p className="font-semibold">{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                </div>
                <span className="text-slate-500">→</span>
              </Link>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-white/[0.08]">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Available Markets</h3>
            <p className="text-2xl font-bold text-white">2,847</p>
            <p className="text-xs text-slate-500 mb-3">Across all 15 niches, 4 countries</p>
            <Link href="/dashboard/markets" className="text-xs font-medium text-[#2563EB] hover:text-white transition-colors">
              Browse available →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

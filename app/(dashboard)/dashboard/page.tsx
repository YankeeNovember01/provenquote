'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const STAT_CARDS = [
  { label: 'Active Leases', value: '3', change: '+1 this month', positive: true },
  { label: 'Leads This Month', value: '84', change: '+12% vs last month', positive: true },
  { label: 'Total Markets Available', value: '2,847', change: 'Across all 15 niches', positive: null },
  { label: 'Spend This Month', value: '$6,800', change: '3 active leases', positive: null },
];

const RECENT_LEADS = [
  { date: 'May 6', niche: 'Roofing', city: 'Austin, TX', name: 'James Carter', phone: '(512) 555-0198', service: 'Full replacement', status: 'New' },
  { date: 'May 6', niche: 'HVAC', city: 'Phoenix, AZ', name: 'Maria Santos', phone: '(602) 555-0134', service: 'AC repair', status: 'Contacted' },
  { date: 'May 5', niche: 'Roofing', city: 'Austin, TX', name: 'Derek Williams', phone: '(512) 555-0276', service: 'Hail damage', status: 'Quoted' },
  { date: 'May 5', niche: 'Solar', city: 'Denver, CO', name: 'Linda Park', phone: '(303) 555-0091', service: 'New install', status: 'Closed' },
  { date: 'May 4', niche: 'HVAC', city: 'Phoenix, AZ', name: 'Tom Bradley', phone: '(602) 555-0183', service: 'System tune-up', status: 'New' },
  { date: 'May 4', niche: 'Roofing', city: 'Austin, TX', name: 'Sarah Kim', phone: '(512) 555-0312', service: 'Inspection', status: 'Contacted' },
  { date: 'May 3', niche: 'Solar', city: 'Denver, CO', name: 'Paul Rivera', phone: '(303) 555-0055', service: 'New install', status: 'Quoted' },
  { date: 'May 3', niche: 'HVAC', city: 'Phoenix, AZ', name: 'Ana Torres', phone: '(602) 555-0228', service: 'Installation', status: 'Closed' },
  { date: 'May 2', niche: 'Roofing', city: 'Austin, TX', name: 'Mike Johnson', phone: '(512) 555-0409', service: 'Repair', status: 'Lost' },
  { date: 'May 2', niche: 'Solar', city: 'Denver, CO', name: 'Rachel Green', phone: '(303) 555-0177', service: 'New install', status: 'New' },
];

const ACTIVE_LEASES = [
  { niche: 'Roofing', city: 'Austin, TX', cost: 2400, nextBilling: 'Jun 1', leadsThisMonth: 34, leadsLastMonth: 28 },
  { niche: 'HVAC', city: 'Phoenix, AZ', cost: 1800, nextBilling: 'Jun 3', leadsThisMonth: 31, leadsLastMonth: 30 },
  { niche: 'Solar', city: 'Denver, CO', cost: 2600, nextBilling: 'Jun 8', leadsThisMonth: 19, leadsLastMonth: 22 },
];

// Generate 30-day chart data
const CHART_DATA = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    leads: Math.floor(Math.random() * 6) + 1,
  };
});

const STATUS_COLORS: Record<string, string> = {
  New: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  Contacted: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  Quoted: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  Closed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  Lost: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-sm text-slate-500">May 2026</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map(({ label, value, change, positive }) => (
          <div key={label} className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
            <p className="text-xs text-slate-500 mb-2">{label}</p>
            <p className="text-3xl font-bold text-white mb-1">{value}</p>
            <p className={`text-xs ${positive === true ? 'text-[#10B981]' : positive === false ? 'text-[#EF4444]' : 'text-slate-500'}`}>
              {change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-6">Leads — Last 30 Days</h2>
          <ResponsiveContainer width="100%" height={200}>
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

        {/* Active Leases */}
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Active Leases</h2>
          <div className="space-y-4">
            {ACTIVE_LEASES.map(lease => {
              const trend = lease.leadsThisMonth >= lease.leadsLastMonth;
              return (
                <div key={`${lease.niche}-${lease.city}`} className="border-b border-white/[0.06] pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-white">{lease.niche}</p>
                    <span className={`text-xs font-semibold ${trend ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                      {trend ? '+' : ''}{lease.leadsThisMonth - lease.leadsLastMonth} leads
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{lease.city} · ${lease.cost.toLocaleString()}/mo</p>
                  <p className="text-xs text-slate-600 mt-0.5">Renews {lease.nextBilling} · {lease.leadsThisMonth} leads this month</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="bg-[#1A2342] px-6 py-4 border-b border-white/[0.08]">
          <h2 className="text-sm font-semibold text-white">Recent Leads</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.08]">
                {['Date', 'Niche', 'City', 'Name', 'Phone', 'Service', 'Status'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_LEADS.map((lead, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors border-b border-white/[0.04] last:border-0">
                  <td className="px-6 py-3.5 text-sm text-slate-500">{lead.date}</td>
                  <td className="px-6 py-3.5 text-sm text-white font-medium">{lead.niche}</td>
                  <td className="px-6 py-3.5 text-sm text-slate-300">{lead.city}</td>
                  <td className="px-6 py-3.5 text-sm text-white">{lead.name}</td>
                  <td className="px-6 py-3.5 text-sm text-slate-400 font-mono">{lead.phone}</td>
                  <td className="px-6 py-3.5 text-sm text-slate-400">{lead.service}</td>
                  <td className="px-6 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[lead.status] ?? ''}`}>
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

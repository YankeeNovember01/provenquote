'use client';

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from 'recharts';

interface Props {
  dailyData: { day: string; leads: number }[];
  statusCounts: Record<string, number>;
  totalLeads: number;
  totalPurchases: number;
  totalSpend: number;
  conversionRate: number;
  activeLeases: { niche: string; city: string; state: string; monthly_cost: number }[];
}

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  bid_sent: 'Bid Sent',
  won: 'Won',
  lost: 'Lost',
};

const STATUS_COLORS: Record<string, string> = {
  new: '#3B82F6',
  contacted: '#EAB308',
  bid_sent: '#A855F7',
  won: '#10B981',
  lost: '#EF4444',
};

export default function AnalyticsClient({
  dailyData,
  statusCounts,
  totalLeads,
  totalPurchases,
  totalSpend,
  conversionRate,
  activeLeases,
}: Props) {
  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: STATUS_LABELS[status] || status,
    value: count,
    status,
  }));

  const monthlyLeaseSpend = activeLeases.reduce((sum, l) => sum + (l.monthly_cost || 0), 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Last 30 days</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Leads', value: totalLeads, sub: 'Last 30 days', color: 'text-blue-400' },
          { label: 'Conversion Rate', value: `${conversionRate}%`, sub: 'Leads → Won', color: 'text-emerald-400' },
          { label: 'Leads Purchased', value: totalPurchases, sub: `$${totalSpend} spent`, color: 'text-purple-400' },
          { label: 'Monthly Lease Spend', value: `$${monthlyLeaseSpend.toLocaleString()}`, sub: `${activeLeases.length} active markets`, color: 'text-amber-400' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-5">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-600 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Lead volume over time */}
        <div className="lg:col-span-2 bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Leads Per Day</h3>
          {totalLeads === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
              No lead data yet. Lease a market to start receiving leads.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dailyData}>
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#475569', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval={4}
                />
                <YAxis
                  tick={{ fill: '#475569', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{ background: '#1A2342', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#2563EB' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status breakdown */}
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Lead Status Breakdown</h3>
          {statusData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-500 text-sm text-center">
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusData} layout="vertical" barSize={12}>
                <XAxis type="number" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#94A3B8', fontSize: 11 }} tickLine={false} axisLine={false} width={70} />
                <Tooltip
                  contentStyle={{ background: '#1A2342', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#fff' }}
                />
                <Bar dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={STATUS_COLORS[entry.status] || '#475569'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Active Leases Table */}
      {activeLeases.length > 0 && (
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Active Market Leases</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left pb-2 text-xs font-semibold text-slate-500 uppercase">Market</th>
                  <th className="text-left pb-2 text-xs font-semibold text-slate-500 uppercase">Niche</th>
                  <th className="text-right pb-2 text-xs font-semibold text-slate-500 uppercase">Monthly Cost</th>
                </tr>
              </thead>
              <tbody>
                {activeLeases.map((lease, i) => (
                  <tr key={i} className="border-b border-white/[0.04] last:border-0">
                    <td className="py-3 text-sm text-white">{lease.city}, {lease.state}</td>
                    <td className="py-3 text-sm text-slate-400">{lease.niche}</td>
                    <td className="py-3 text-sm text-right font-medium text-white">${lease.monthly_cost.toLocaleString()}/mo</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeLeases.length === 0 && totalLeads === 0 && (
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-12 text-center">
          <p className="text-slate-400 mb-2">No analytics data yet.</p>
          <p className="text-slate-500 text-sm mb-6">Lease your first market to start tracking lead volume and conversions.</p>
          <a href="/dashboard/markets" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-block">
            Browse Markets →
          </a>
        </div>
      )}
    </div>
  );
}

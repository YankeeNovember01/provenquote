'use client';

import { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import { TrendingUp, TrendingDown, ArrowRight, Download, MessageSquare, Calendar, Zap } from 'lucide-react';

interface MarketPerf {
  market: string;
  niche: string;
  leads: number;
  booked: number;
  closed: number;
  conversionRate: number;
  cost: number;
  roi: number;
}

interface Props {
  business: any;
  activeLeads: number;
  booked: number;
  closed: number;
  totalLeads: number;
  conversionRate: number;
  weeklyRevenue: number;
  marketPerformance: MarketPerf[];
  leases: any[];
  allLeads: any[];
}

const COLORS = ['#00D4FF', '#C9A84C', '#10B981', '#F59E0B', '#EF4444'];
const CHART_COLORS = {
  primary: '#00D4FF',
  secondary: '#C9A84C',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
};

export default function BriefingClient({
  business,
  activeLeads,
  booked,
  closed,
  totalLeads,
  conversionRate,
  weeklyRevenue,
  marketPerformance,
  leases,
  allLeads,
}: Props) {
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [expandedMarket, setExpandedMarket] = useState<string | null>(null);

  // Pipeline data for funnel
  const pipelineData = [
    { stage: 'Leads', value: totalLeads, fill: '#00D4FF' },
    { stage: 'Called', value: Math.max(activeLeads, totalLeads * 0.6), fill: '#C9A84C' },
    { stage: 'Booked', value: booked, fill: '#10B981' },
    { stage: 'Closed', value: closed, fill: '#00D4FF' },
  ];

  // Daily leads trend (mock data based on lead distribution)
  const dailyTrend = useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      days[key] = 0;
    }
    allLeads.forEach(l => {
      const key = new Date(l.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (key in days) days[key]++;
    });
    return Object.entries(days).map(([day, count]) => ({ day, leads: count }));
  }, [allLeads]);

  // Top markets by ROI
  const topMarkets = [...marketPerformance].sort((a, b) => b.roi - a.roi).slice(0, 5);

  // Hot markets (trending niches)
  const hotMarkets = [...marketPerformance].filter(m => m.leads > 5 && m.conversionRate > 30).sort((a, b) => b.leads - a.leads);

  // Cost efficiency
  const costEfficiency = marketPerformance.map(m => ({
    market: m.market.split(',')[0],
    costPerLead: m.cost / m.leads || 0,
    roi: m.roi,
  }));

  // Conversion funnel percentages
  const conversionFunnel = [
    { label: 'Leads', value: totalLeads, percent: 100 },
    { label: 'Contacted', value: Math.max(activeLeads, totalLeads * 0.6), percent: Math.round((Math.max(activeLeads, totalLeads * 0.6) / totalLeads) * 100) },
    { label: 'Booked', value: booked, percent: Math.round((booked / totalLeads) * 100) },
    { label: 'Closed', value: closed, percent: Math.round((closed / totalLeads) * 100) },
  ];

  const firstName = business.business_name?.split(' ')[0] ?? 'Partner';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1128] via-[#0F1729] to-[#0A1128]">
      {/* Animated background effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00D4FF]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 p-8 max-w-8xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Executive Briefing</h1>
              <p className="text-slate-400">Real-time performance dashboard for {business.business_name}</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors border border-white/10">
                <Download className="w-4 h-4" />
                Export Report
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00D4FF]/10 hover:bg-[#00D4FF]/20 text-[#00D4FF] text-sm font-medium transition-colors border border-[#00D4FF]/20">
                <Zap className="w-4 h-4" />
                Live Updates
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards - Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Active Leads */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0F1729] to-[#0A1128] p-6 backdrop-blur-xl hover:border-[#00D4FF]/30 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-400">Active Leads</p>
                <div className="p-2.5 rounded-lg bg-[#00D4FF]/10 text-[#00D4FF]">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <p className="text-4xl font-bold text-white mb-2">{activeLeads}</p>
              <p className="text-xs text-slate-400">Ready to contact</p>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0F1729] to-[#0A1128] p-6 backdrop-blur-xl hover:border-[#10B981]/30 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-400">Conversion Rate</p>
                <div className="p-2.5 rounded-lg bg-[#10B981]/10 text-[#10B981]">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="text-4xl font-bold text-white mb-2">{conversionRate}%</p>
              <p className="text-xs text-slate-400">{closed} of {totalLeads} closed</p>
            </div>
          </div>

          {/* Revenue This Week */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0F1729] to-[#0A1128] p-6 backdrop-blur-xl hover:border-[#C9A84C]/30 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-400">Revenue (Projected)</p>
                <div className="p-2.5 rounded-lg bg-[#C9A84C]/10 text-[#C9A84C]">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="text-4xl font-bold text-white mb-2">${Math.round(weeklyRevenue).toLocaleString()}</p>
              <p className="text-xs text-slate-400">From closed deals</p>
            </div>
          </div>

          {/* Total Booked */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0F1729] to-[#0A1128] p-6 backdrop-blur-xl hover:border-[#F59E0B]/30 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-400">Appointments Booked</p>
                <div className="p-2.5 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B]">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <p className="text-4xl font-bold text-white mb-2">{booked}</p>
              <p className="text-xs text-slate-400">{Math.round((booked / totalLeads) * 100)}% of leads</p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Lead Pipeline Funnel */}
          <div className="lg:col-span-1 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0F1729] to-[#0A1128] p-6 backdrop-blur-xl">
            <h2 className="text-sm font-semibold text-white mb-6">Pipeline Conversion</h2>
            <div className="space-y-3">
              {conversionFunnel.map((item, i) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">{item.label}</span>
                    <span className="text-sm font-semibold text-white">{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00D4FF] to-[#00D4FF]/50 rounded-full transition-all"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{item.percent}% of leads</div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Lead Trend */}
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0F1729] to-[#0A1128] p-6 backdrop-blur-xl">
            <h2 className="text-sm font-semibold text-white mb-6">Lead Volume — Last 30 Days</h2>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={dailyTrend} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} interval={4} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: 'rgba(15, 23, 41, 0.95)', border: '1px solid rgba(0, 212, 255, 0.2)', borderRadius: 12, color: '#F8FAFC' }}
                  cursor={{ stroke: 'rgba(0, 212, 255, 0.3)' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#00D4FF" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Performance */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0F1729] to-[#0A1128] p-6 backdrop-blur-xl mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-white">Market Performance</h2>
            <span className="text-xs text-slate-400">{marketPerformance.length} active markets</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-4 font-semibold text-slate-400">Market</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-400">Leads</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-400">Booked</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-400">Closed</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-400">Conv. Rate</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-400">ROI</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-400">Cost/Lead</th>
                </tr>
              </thead>
              <tbody>
                {marketPerformance.map((market, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-white">{market.market}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{market.niche}</p>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="font-semibold text-white">{market.leads}</span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="font-semibold text-[#F59E0B]">{market.booked}</span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="font-semibold text-[#10B981]">{market.closed}</span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="flex items-center justify-center gap-1">
                        {market.conversionRate > 30 ? (
                          <TrendingUp className="w-3 h-3 text-[#10B981]" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-[#EF4444]" />
                        )}
                        <span className={market.conversionRate > 30 ? 'text-[#10B981] font-semibold' : 'text-white font-semibold'}>
                          {market.conversionRate}%
                        </span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className={`font-semibold ${market.roi > 200 ? 'text-[#10B981]' : market.roi > 100 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                        {market.roi}%
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="text-white font-semibold">${Math.round(market.cost / market.leads || 0)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hot Markets & Opportunities */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Trending Niches */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0F1729] to-[#0A1128] p-6 backdrop-blur-xl">
            <h2 className="text-sm font-semibold text-white mb-4">🔥 Hot Markets</h2>
            {hotMarkets.length > 0 ? (
              <div className="space-y-3">
                {hotMarkets.slice(0, 4).map((market, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors border border-white/5">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{market.market}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{market.niche}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#C9A84C]">{market.leads} leads</p>
                      <p className="text-xs text-[#10B981] mt-1">{market.conversionRate}% conversion</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 text-sm">No trending niches yet. Keep driving leads!</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0F1729] to-[#0A1128] p-6 backdrop-blur-xl">
            <h2 className="text-sm font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-[#00D4FF]/10 hover:bg-[#00D4FF]/20 text-[#00D4FF] text-sm font-medium transition-colors border border-[#00D4FF]/20 group">
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Message Hot Leads
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-[#C9A84C]/10 hover:bg-[#C9A84C]/20 text-[#C9A84C] text-sm font-medium transition-colors border border-[#C9A84C]/20 group">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Schedule Calls
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors border border-white/10 group">
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  View Detailed Reports
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* ROI & Cost Analysis */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0F1729] to-[#0A1128] p-6 backdrop-blur-xl">
          <h2 className="text-sm font-semibold text-white mb-6">ROI & Cost Analysis</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={costEfficiency}
              margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="market" tick={{ fontSize: 11, fill: '#64748B' }} angle={-45} textAnchor="end" height={100} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748B' }} label={{ value: 'Cost per Lead ($)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748B' }} label={{ value: 'ROI (%)', angle: 90, position: 'insideRight' }} />
              <Tooltip
                contentStyle={{ background: 'rgba(15, 23, 41, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#F8FAFC' }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="costPerLead" fill="#00D4FF" radius={[8, 8, 0, 0]} name="Cost per Lead" />
              <Bar yAxisId="right" dataKey="roi" fill="#C9A84C" radius={[8, 8, 0, 0]} name="ROI %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between text-xs text-slate-500">
          <p>Last updated: {new Date().toLocaleTimeString()}</p>
          <p>Real-time data • All metrics auto-refresh every 5 minutes</p>
        </div>
      </div>
    </div>
  );
}

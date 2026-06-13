'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

/* ──────────────────────────────────────────────────────────────
   ProvenQuote · Executive Briefing Room
   Premium partner-facing intelligence dashboard
   ────────────────────────────────────────────────────────────── */

const NAVY = '#080C14';
const BLUE = '#2563EB';
const CYAN = '#00D4FF';
const GOLD = '#C9A84C';
const GREEN = '#10B981';

// ── Demo intelligence data (replace with live Supabase queries when wired) ──
const REVENUE_TREND = [
  { month: 'Jan', mrr: 312, leads: 540 },
  { month: 'Feb', mrr: 358, leads: 602 },
  { month: 'Mar', mrr: 421, leads: 689 },
  { month: 'Apr', mrr: 503, leads: 731 },
  { month: 'May', mrr: 624, leads: 808 },
  { month: 'Jun', mrr: 847, leads: 971 },
];

const NICHE_SPLIT = [
  { name: 'Roofing', value: 34, color: BLUE },
  { name: 'HVAC', value: 24, color: CYAN },
  { name: 'Plumbing', value: 18, color: GOLD },
  { name: 'Electrical', value: 13, color: GREEN },
  { name: 'Other', value: 11, color: '#64748B' },
];

const FUNNEL = [
  { stage: 'Page Visits', value: 100, fill: BLUE },
  { stage: 'Quote Forms', value: 42, fill: CYAN },
  { stage: 'Qualified', value: 27, fill: GOLD },
  { stage: 'Booked', value: 18, fill: GREEN },
];

const MARKETS = [
  { market: 'Roofing', city: 'Austin, TX', leads: 68, closed: 12, conv: 17.6, cost: 3000, roi: 1683 },
  { market: 'Plumbing', city: 'Phoenix, AZ', leads: 72, closed: 13, conv: 18.1, cost: 2800, roi: 1858 },
  { market: 'HVAC', city: 'Denver, CO', leads: 54, closed: 9, conv: 16.7, cost: 2500, roi: 1440 },
  { market: 'Landscaping', city: 'Seattle, WA', leads: 52, closed: 8, conv: 15.4, cost: 2400, roi: 1333 },
  { market: 'Electrical', city: 'Portland, OR', leads: 45, closed: 7, conv: 15.6, cost: 2200, roi: 1136 },
];

const KPIS = [
  { label: 'Monthly Recurring Revenue', value: '$847K', delta: '+35.7%', positive: true, spark: REVENUE_TREND.map(d => d.mrr), accent: BLUE },
  { label: 'Leads Delivered (MTD)', value: '971', delta: '+20.2%', positive: true, spark: REVENUE_TREND.map(d => d.leads), accent: CYAN },
  { label: 'Avg. Conversion Rate', value: '18.2%', delta: '+2.1pts', positive: true, spark: [14, 15, 16, 16.5, 17.4, 18.2], accent: GOLD },
  { label: 'Active Market Leases', value: '142', delta: '+18', positive: true, spark: [96, 104, 112, 121, 130, 142], accent: GREEN },
];

type SortKey = 'leads' | 'closed' | 'conv' | 'roi';

function MiniSpark({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={36}>
      <AreaChart data={chartData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.45} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2}
          fill={`url(#spark-${color})`} dot={false} isAnimationActive />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function PartnershipBriefingPage() {
  const router = useRouter();
  const [partnerName, setPartnerName] = useState<string | null>(null);
  const [partnerRole, setPartnerRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'markets' | 'growth'>('overview');
  const [sortKey, setSortKey] = useState<SortKey>('roi');

  useEffect(() => {
    const name = typeof window !== 'undefined' ? localStorage.getItem('partnerName') : null;
    const role = typeof window !== 'undefined' ? localStorage.getItem('partnerRole') : null;
    if (!name) { router.push('/partnership'); return; }
    setPartnerName(name);
    setPartnerRole(role);
    setIsLoading(false);
  }, [router]);

  const sortedMarkets = useMemo(
    () => [...MARKETS].sort((a, b) => (b[sortKey] as number) - (a[sortKey] as number)),
    [sortKey]
  );

  const handleLogout = () => {
    localStorage.removeItem('partnerName');
    localStorage.removeItem('partnerRole');
    router.push('/partnership');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: NAVY }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: CYAN }} />
          <p className="mt-4 text-slate-400">Loading briefing room…</p>
        </div>
      </div>
    );
  }

  const firstName = (partnerName ?? 'Partner').split(' ')[0];

  return (
    <div className="min-h-screen text-white" style={{ background: NAVY }}>
      <style>{`
        @keyframes bfUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        .bf-a1 { animation: bfUp .5s cubic-bezier(.34,1.56,.64,1) both }
        .bf-a2 { animation: bfUp .5s cubic-bezier(.34,1.56,.64,1) .08s both }
        .bf-a3 { animation: bfUp .5s cubic-bezier(.34,1.56,.64,1) .16s both }
        .bf-a4 { animation: bfUp .5s cubic-bezier(.34,1.56,.64,1) .24s both }
        .bf-kpi { transition: all .22s cubic-bezier(.34,1.56,.64,1) }
        .bf-kpi:hover { transform: translateY(-4px); border-color: rgba(0,212,255,.45)!important; box-shadow: 0 16px 40px rgba(0,212,255,.12) }
        .bf-tab { transition: all .18s ease }
        .bf-row { transition: background .15s ease }
        .bf-row:hover { background: rgba(255,255,255,.03) }
      `}</style>

      {/* ── Briefing header ── */}
      <header className="sticky top-0 z-50 border-b backdrop-blur" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(8,12,20,0.92)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-bold text-lg tracking-tight text-white">
              ProvenQuote<span style={{ color: BLUE }}>.ai</span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full"
              style={{ color: CYAN, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)' }}>
              ◆ Executive Briefing Room
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white leading-tight">{partnerName}</p>
              <p className="text-xs text-slate-500 leading-tight">{partnerRole}</p>
            </div>
            <button onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div aria-hidden className="absolute inset-0 opacity-[0.18]"
          style={{ backgroundImage: 'linear-gradient(rgba(37,99,235,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,.4) 1px,transparent 1px)', backgroundSize: '54px 54px' }} />
        <div aria-hidden className="absolute -top-32 right-0 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.10) 0%, transparent 70%)' }} />
        <div className="relative max-w-7xl mx-auto px-6 py-14">
          <div className="bf-a1 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] px-4 py-1.5 rounded-full mb-5"
            style={{ color: GOLD, background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.3)' }}>
            ✦ Confidential Partner Intelligence
          </div>
          <h1 className="bf-a1 text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Welcome, {firstName}.
          </h1>
          <p className="bf-a2 text-lg max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            A real-time view into ProvenQuote's market performance, lead economics, and growth
            trajectory. Every metric updates as the network scales.
          </p>

          {/* Tabs */}
          <div className="bf-a3 mt-8 inline-flex p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {([['overview', 'Overview'], ['markets', 'Markets'], ['growth', 'Growth']] as const).map(([k, label]) => (
              <button key={k} onClick={() => setTab(k)}
                className="bf-tab px-5 py-2 text-sm font-semibold rounded-lg"
                style={tab === k
                  ? { background: BLUE, color: '#fff' }
                  : { background: 'transparent', color: 'rgba(255,255,255,0.55)' }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* ── KPI Row (always visible) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {KPIS.map((k, i) => (
            <div key={k.label} className="bf-kpi rounded-2xl p-5"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.08)', animation: `bfUp .5s cubic-bezier(.34,1.56,.64,1) ${i * 0.06}s both` }}>
              <p className="text-xs text-slate-400 mb-2 leading-tight">{k.label}</p>
              <div className="flex items-end justify-between gap-2">
                <p className="text-3xl font-bold text-white tracking-tight">{k.value}</p>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ color: k.positive ? GREEN : '#F87171', background: k.positive ? 'rgba(16,185,129,0.12)' : 'rgba(248,113,113,0.12)' }}>
                  {k.delta}
                </span>
              </div>
              <div className="mt-3"><MiniSpark data={k.spark} color={k.accent} /></div>
            </div>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab === 'overview' && (
          <div className="bf-a2 space-y-8">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Revenue area chart */}
              <div className="lg:col-span-2 rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white">Revenue & Lead Growth</h2>
                    <p className="text-xs text-slate-500">Monthly recurring revenue ($K) vs. leads delivered</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full" style={{ color: GREEN, background: 'rgba(16,185,129,0.12)' }}>Trailing 6 mo</span>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={REVENUE_TREND} margin={{ top: 0, right: 8, bottom: 0, left: -16 }}>
                    <defs>
                      <linearGradient id="gMrr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={BLUE} stopOpacity={0.5} />
                        <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gLeads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CYAN} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={CYAN} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: '#0F1729', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
                    <Area type="monotone" dataKey="leads" stroke={CYAN} strokeWidth={2} fill="url(#gLeads)" name="Leads" />
                    <Area type="monotone" dataKey="mrr" stroke={BLUE} strokeWidth={2.5} fill="url(#gMrr)" name="MRR ($K)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Niche split pie */}
              <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h2 className="text-lg font-bold text-white mb-1">Lead Mix by Niche</h2>
                <p className="text-xs text-slate-500 mb-4">Share of total leads delivered</p>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={NICHE_SPLIT} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3} stroke="none">
                      {NICHE_SPLIT.map((d) => <Cell key={d.name} fill={d.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0F1729', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {NICHE_SPLIT.map((d) => (
                    <div key={d.name} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-slate-300">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />{d.name}
                      </span>
                      <span className="text-slate-400 font-medium">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Strategic insights */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">📈 Growth Opportunities</h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  {[
                    'Expand HVAC into Colorado Springs — +$8K MRR potential',
                    'Launch Solar in high-penetration metros (Phoenix, Austin)',
                    'Lift Plumbing conv. rate to Roofing benchmark (+1.5pts)',
                    'Bundle adjacent niches per metro for lease upsell',
                  ].map((t) => (
                    <li key={t} className="flex gap-3"><span style={{ color: CYAN }}>→</span>{t}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">⚡ Recent Highlights</h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  {[
                    'Q2 revenue exceeded plan by 23%',
                    'Lead-quality scores up across every active market',
                    '142 markets now leased — 18 added this month',
                    'Real-time SMS + email delivery live in all metros',
                  ].map((t) => (
                    <li key={t} className="flex gap-3"><span style={{ color: GOLD }}>•</span>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── MARKETS TAB ── */}
        {tab === 'markets' && (
          <div className="bf-a2 rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-bold text-white">Market Performance</h2>
                <p className="text-xs text-slate-500">Per-market lead economics · sorted by {sortKey.toUpperCase()}</p>
              </div>
              <div className="flex gap-2">
                {(['roi', 'conv', 'leads', 'closed'] as SortKey[]).map((k) => (
                  <button key={k} onClick={() => setSortKey(k)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors"
                    style={sortKey === k ? { background: BLUE, color: '#fff' } : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)' }}>
                    {k === 'conv' ? 'Conv %' : k.charAt(0).toUpperCase() + k.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Market</th>
                    <th className="text-right py-3 px-4 text-slate-400 font-semibold">Leads</th>
                    <th className="text-right py-3 px-4 text-slate-400 font-semibold">Closed</th>
                    <th className="text-right py-3 px-4 text-slate-400 font-semibold">Conv.</th>
                    <th className="text-right py-3 px-4 text-slate-400 font-semibold">Lease/mo</th>
                    <th className="text-right py-3 px-4 text-slate-400 font-semibold">ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedMarkets.map((r) => (
                    <tr key={r.city} className="bf-row border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                      <td className="py-4 px-4">
                        <p className="text-white font-medium">{r.market}</p>
                        <p className="text-xs text-slate-500">{r.city}</p>
                      </td>
                      <td className="py-4 px-4 text-right text-slate-300">{r.leads}</td>
                      <td className="py-4 px-4 text-right text-white font-semibold">{r.closed}</td>
                      <td className="py-4 px-4 text-right">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ color: GREEN, background: 'rgba(16,185,129,0.15)' }}>{r.conv}%</span>
                      </td>
                      <td className="py-4 px-4 text-right text-slate-300">${r.cost.toLocaleString()}</td>
                      <td className="py-4 px-4 text-right">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ color: CYAN, background: 'rgba(0,212,255,0.15)' }}>{r.roi}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── GROWTH TAB ── */}
        {tab === 'growth' && (
          <div className="bf-a2 grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h2 className="text-lg font-bold text-white mb-1">Lead Funnel</h2>
              <p className="text-xs text-slate-500 mb-4">Visitor → booked job conversion</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={FUNNEL} layout="vertical" margin={{ left: 24, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                  <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="stage" stroke="rgba(255,255,255,0.55)" fontSize={12} tickLine={false} axisLine={false} width={90} />
                  <Tooltip contentStyle={{ background: '#0F1729', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {FUNNEL.map((d) => <Cell key={d.stage} fill={d.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h2 className="text-lg font-bold text-white mb-1">Monthly Leads Delivered</h2>
              <p className="text-xs text-slate-500 mb-4">Network-wide volume</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={REVENUE_TREND} margin={{ left: -16, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#0F1729', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="leads" fill={CYAN} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── Next steps CTA ── */}
        <div className="mt-10 rounded-2xl p-8" style={{ background: 'linear-gradient(120deg, rgba(37,99,235,0.18), rgba(0,212,255,0.10))', border: '1px solid rgba(0,212,255,0.25)' }}>
          <h3 className="text-lg font-bold text-white mb-2">Discuss the numbers</h3>
          <p className="text-slate-300 mb-6 max-w-2xl text-sm">
            For deeper market analysis, the data room, or partnership terms, reach the ProvenQuote team directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="mailto:partners@provenquote.ai?subject=Briefing%20Follow-up"
              className="inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg transition-colors"
              style={{ background: CYAN, color: NAVY }}>
              Schedule a Call
            </a>
            <a href="mailto:partners@provenquote.ai?subject=Partnership%20Inquiry"
              className="inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg transition-colors"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}>
              Send a Message
            </a>
          </div>
        </div>
      </main>

      <div aria-hidden className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 right-40 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(37,99,235,0.06)' }} />
        <div className="absolute bottom-40 left-40 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(0,212,255,0.05)' }} />
      </div>
    </div>
  );
}

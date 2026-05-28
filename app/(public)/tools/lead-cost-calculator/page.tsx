'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';

const NICHES = [
  { name: 'Roofing', avgLead: 105 },
  { name: 'HVAC', avgLead: 72 },
  { name: 'Plumbing', avgLead: 62 },
  { name: 'Solar', avgLead: 132 },
  { name: 'Landscaping', avgLead: 50 },
  { name: 'Electrical', avgLead: 56 },
  { name: 'Painting', avgLead: 37 },
  { name: 'Fencing', avgLead: 33 },
  { name: 'Concrete & Driveways', avgLead: 43 },
  { name: 'Gutters', avgLead: 27 },
  { name: 'Pest Control', avgLead: 22 },
  { name: 'Cleaning', avgLead: 18 },
  { name: 'Windows & Doors', avgLead: 46 },
  { name: 'Garage Doors', avgLead: 31 },
  { name: 'Flooring', avgLead: 41 },
];

export default function LeadCostCalculatorPage() {
  const [niche, setNiche] = useState(NICHES[0]);
  const [leadsPerMonth, setLeadsPerMonth] = useState(15);
  const [leadPrice, setLeadPrice] = useState(NICHES[0].avgLead);
  const [closeRate, setCloseRate] = useState(20);
  const [avgJobValue, setAvgJobValue] = useState(8500);

  const results = useMemo(() => {
    const monthlySpend = leadsPerMonth * leadPrice;
    const jobsClosed = Math.round((leadsPerMonth * closeRate) / 100);
    const monthlyRevenue = jobsClosed * avgJobValue;
    const costPerAcquisition = jobsClosed > 0 ? monthlySpend / jobsClosed : 0;
    const roi = monthlySpend > 0 ? (monthlyRevenue - monthlySpend) / monthlySpend : 0;
    const profitFromLeads = monthlyRevenue - monthlySpend;

    // Exclusive comparison (assumes same job value, 32% close rate, 20 leads from page)
    const exclusiveLeads = 20;
    const exclusiveClose = 0.32;
    const exclusiveJobs = Math.round(exclusiveLeads * exclusiveClose);
    const exclusiveRevenue = exclusiveJobs * avgJobValue;
    const exclusiveLeaseCost = leadPrice * 12; // rough proxy
    const exclusiveProfit = exclusiveRevenue - exclusiveLeaseCost;

    return {
      monthlySpend,
      jobsClosed,
      monthlyRevenue,
      costPerAcquisition,
      roi,
      profitFromLeads,
      exclusiveJobs,
      exclusiveRevenue,
      exclusiveLeaseCost,
      exclusiveProfit,
      revenueGain: exclusiveProfit - profitFromLeads,
    };
  }, [leadsPerMonth, leadPrice, closeRate, avgJobValue]);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/tools" className="text-sm text-slate-500 hover:text-white transition-colors mb-8 inline-flex items-center gap-1">
        ← Back to Tools
      </Link>

      <div className="mb-12 mt-6">
        <h1 className="text-4xl font-bold text-white mb-4">Lead Cost Calculator</h1>
        <p className="text-slate-400 leading-relaxed">
          Enter your current lead spend to see your true cost per acquired customer — then compare it against exclusive market leads.
        </p>
      </div>

      {/* Inputs */}
      <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8 mb-8">
        <h2 className="text-lg font-semibold text-white mb-6">Your current lead setup</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
              Service niche
            </label>
            <select
              className="w-full bg-[#1A2342] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#2563EB]"
              value={niche.name}
              onChange={(e) => {
                const found = NICHES.find((n) => n.name === e.target.value)!;
                setNiche(found);
                setLeadPrice(found.avgLead);
              }}
            >
              {NICHES.map((n) => (
                <option key={n.name} value={n.name}>{n.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
              Leads per month: <span className="text-white">{leadsPerMonth}</span>
            </label>
            <input
              type="range" min={5} max={100} step={5}
              value={leadsPerMonth}
              onChange={(e) => setLeadsPerMonth(Number(e.target.value))}
              className="w-full accent-[#2563EB]"
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>5</span><span>100</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
              Avg lead price: <span className="text-white">${leadPrice}</span>
            </label>
            <input
              type="range" min={10} max={250} step={5}
              value={leadPrice}
              onChange={(e) => setLeadPrice(Number(e.target.value))}
              className="w-full accent-[#2563EB]"
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>$10</span><span>$250</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
              Close rate: <span className="text-white">{closeRate}%</span>
            </label>
            <input
              type="range" min={5} max={60} step={1}
              value={closeRate}
              onChange={(e) => setCloseRate(Number(e.target.value))}
              className="w-full accent-[#2563EB]"
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>5%</span><span>60%</span>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
              Average job value: <span className="text-white">{fmt(avgJobValue)}</span>
            </label>
            <input
              type="range" min={500} max={50000} step={500}
              value={avgJobValue}
              onChange={(e) => setAvgJobValue(Number(e.target.value))}
              className="w-full accent-[#2563EB]"
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>$500</span><span>$50,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8 mb-8">
        <h2 className="text-lg font-semibold text-white mb-6">Your current lead economics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { label: 'Monthly lead spend', value: fmt(results.monthlySpend), color: 'text-white' },
            { label: 'Jobs closed', value: `${results.jobsClosed}/mo`, color: 'text-white' },
            { label: 'Monthly revenue from leads', value: fmt(results.monthlyRevenue), color: 'text-white' },
            { label: 'Cost per acquisition', value: fmt(results.costPerAcquisition), color: 'text-[#F59E0B]' },
            { label: 'Lead spend ROI', value: `${(results.roi * 100).toFixed(0)}%`, color: results.roi > 5 ? 'text-[#10B981]' : 'text-[#EF4444]' },
            { label: 'Profit from leads', value: fmt(results.profitFromLeads), color: results.profitFromLeads > 0 ? 'text-[#10B981]' : 'text-[#EF4444]' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#1A2342] rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">{label}</p>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Exclusive comparison */}
      <div className="bg-gradient-to-br from-[#2563EB]/10 to-[#0F1729] border border-[#2563EB]/30 rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg font-semibold text-white">Exclusive market lease comparison</h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#2563EB]/20 text-[#2563EB]">Estimate</span>
        </div>
        <p className="text-sm text-slate-400 mb-6">
          Based on typical ProvenQuote page performance for {niche.name} — 20 leads/month, 32% close rate (exclusive average).
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { label: 'Monthly lease cost', value: fmt(results.exclusiveLeaseCost), color: 'text-white' },
            { label: 'Jobs closed', value: `${results.exclusiveJobs}/mo`, color: 'text-white' },
            { label: 'Monthly revenue', value: fmt(results.exclusiveRevenue), color: 'text-white' },
            { label: 'Profit from leads', value: fmt(results.exclusiveProfit), color: 'text-[#10B981]' },
            { label: 'Revenue gain vs shared', value: fmt(results.revenueGain), color: results.revenueGain > 0 ? 'text-[#10B981]' : 'text-[#EF4444]' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#1A2342]/80 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">{label}</p>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-slate-500 mb-6">
          These are estimates based on platform averages. Actual results vary by market, competition, and your sales process.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/markets"
            className="inline-flex items-center justify-center min-h-[48px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-8 rounded-lg transition-colors"
          >
            Check Market Availability
          </Link>
          <Link
            href="/tools/market-roi-estimator"
            className="inline-flex items-center justify-center min-h-[48px] bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 rounded-lg transition-colors"
          >
            Try ROI Estimator
          </Link>
        </div>
      </div>
    </div>
  );
}

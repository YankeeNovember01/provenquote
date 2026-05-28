'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';

const NICHES = [
  { name: 'Roofing', slug: 'roofing', leasePriceFrom: 800, avgLeads: 22, avgJobValue: 9500 },
  { name: 'HVAC', slug: 'hvac', leasePriceFrom: 600, avgLeads: 20, avgJobValue: 3800 },
  { name: 'Plumbing', slug: 'plumbing', leasePriceFrom: 500, avgLeads: 24, avgJobValue: 2200 },
  { name: 'Solar', slug: 'solar', leasePriceFrom: 1200, avgLeads: 14, avgJobValue: 28000 },
  { name: 'Landscaping', slug: 'landscaping', leasePriceFrom: 400, avgLeads: 30, avgJobValue: 1800 },
  { name: 'Electrical', slug: 'electrical', leasePriceFrom: 450, avgLeads: 22, avgJobValue: 2800 },
  { name: 'Painting', slug: 'painting', leasePriceFrom: 300, avgLeads: 26, avgJobValue: 3500 },
  { name: 'Fencing', slug: 'fencing', leasePriceFrom: 250, avgLeads: 18, avgJobValue: 4200 },
  { name: 'Concrete & Driveways', slug: 'concrete', leasePriceFrom: 350, avgLeads: 16, avgJobValue: 5500 },
  { name: 'Gutters', slug: 'gutters', leasePriceFrom: 200, avgLeads: 28, avgJobValue: 1200 },
  { name: 'Pest Control', slug: 'pest-control', leasePriceFrom: 180, avgLeads: 35, avgJobValue: 350 },
  { name: 'Cleaning', slug: 'cleaning', leasePriceFrom: 150, avgLeads: 40, avgJobValue: 280 },
  { name: 'Windows & Doors', slug: 'windows', leasePriceFrom: 380, avgLeads: 20, avgJobValue: 6500 },
  { name: 'Garage Doors', slug: 'garage-doors', leasePriceFrom: 220, avgLeads: 32, avgJobValue: 1400 },
  { name: 'Flooring', slug: 'flooring', leasePriceFrom: 320, avgLeads: 22, avgJobValue: 4800 },
];

const CITY_MULTIPLIERS = [
  { label: 'Small city (50k–150k pop)', multiplier: 1.0 },
  { label: 'Medium city (150k–500k pop)', multiplier: 1.6 },
  { label: 'Large city (500k–1M pop)', multiplier: 2.4 },
  { label: 'Major metro (1M+ pop)', multiplier: 3.5 },
];

export default function MarketROIEstimatorPage() {
  const [niche, setNiche] = useState(NICHES[0]);
  const [cityTier, setCityTier] = useState(CITY_MULTIPLIERS[1]);
  const [customJobValue, setCustomJobValue] = useState(niche.avgJobValue);
  const [closeRate, setCloseRate] = useState(28);
  const [useCustomJobValue, setUseCustomJobValue] = useState(false);

  const results = useMemo(() => {
    const monthlyLeads = Math.round(niche.avgLeads * cityTier.multiplier);
    const leaseCost = Math.round(niche.leasePriceFrom * cityTier.multiplier);
    const jobValue = useCustomJobValue ? customJobValue : niche.avgJobValue;
    const jobsClosed = Math.round((monthlyLeads * closeRate) / 100);
    const monthlyRevenue = jobsClosed * jobValue;
    const profit = monthlyRevenue - leaseCost;
    const roi = leaseCost > 0 ? (profit / leaseCost) * 100 : 0;
    const breakEvenJobs = leaseCost > 0 ? Math.ceil(leaseCost / jobValue) : 0;
    const costPerLead = monthlyLeads > 0 ? leaseCost / monthlyLeads : 0;

    return {
      monthlyLeads,
      leaseCost,
      jobsClosed,
      monthlyRevenue,
      profit,
      roi,
      breakEvenJobs,
      costPerLead,
      jobValue,
    };
  }, [niche, cityTier, closeRate, customJobValue, useCustomJobValue]);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/tools" className="text-sm text-slate-500 hover:text-white transition-colors mb-8 inline-flex items-center gap-1">
        ← Back to Tools
      </Link>

      <div className="mb-12 mt-6">
        <h1 className="text-4xl font-bold text-white mb-4">Market ROI Estimator</h1>
        <p className="text-slate-400 leading-relaxed">
          Pick a niche and city size, enter your close rate and average job value, and see your estimated monthly return from an exclusive market lease.
        </p>
      </div>

      {/* Inputs */}
      <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8 mb-8">
        <h2 className="text-lg font-semibold text-white mb-6">Your market details</h2>

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
                setCustomJobValue(found.avgJobValue);
              }}
            >
              {NICHES.map((n) => (
                <option key={n.name} value={n.name}>{n.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
              City size
            </label>
            <select
              className="w-full bg-[#1A2342] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#2563EB]"
              value={cityTier.label}
              onChange={(e) => {
                const found = CITY_MULTIPLIERS.find((c) => c.label === e.target.value)!;
                setCityTier(found);
              }}
            >
              {CITY_MULTIPLIERS.map((c) => (
                <option key={c.label} value={c.label}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
              Close rate: <span className="text-white">{closeRate}%</span>
            </label>
            <input
              type="range" min={10} max={60} step={1}
              value={closeRate}
              onChange={(e) => setCloseRate(Number(e.target.value))}
              className="w-full accent-[#2563EB]"
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>10%</span><span>60%</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
              Average job value
              {!useCustomJobValue && (
                <button
                  onClick={() => setUseCustomJobValue(true)}
                  className="ml-2 text-[#2563EB] normal-case font-normal hover:underline"
                >
                  (customize)
                </button>
              )}
            </label>
            {useCustomJobValue ? (
              <input
                type="number"
                min={100}
                max={100000}
                step={100}
                value={customJobValue}
                onChange={(e) => setCustomJobValue(Number(e.target.value))}
                className="w-full bg-[#1A2342] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#2563EB]"
              />
            ) : (
              <div className="bg-[#1A2342] border border-white/[0.08] rounded-lg px-4 py-3 text-slate-400 text-sm">
                {fmt(niche.avgJobValue)} <span className="text-slate-600">(industry average for {niche.name})</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-gradient-to-br from-[#2563EB]/10 to-[#0F1729] border border-[#2563EB]/30 rounded-2xl p-8 mb-8">
        <h2 className="text-lg font-semibold text-white mb-2">Your estimated monthly results</h2>
        <p className="text-xs text-slate-500 mb-6">
          Based on typical page performance for {niche.name} in a {cityTier.label.toLowerCase()}.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Monthly leads', value: `~${results.monthlyLeads}`, color: 'text-white' },
            { label: 'Cost per lead', value: fmt(results.costPerLead), color: 'text-white' },
            { label: 'Monthly lease cost', value: fmt(results.leaseCost), color: 'text-white' },
            { label: 'Jobs closed', value: `${results.jobsClosed}/mo`, color: 'text-white' },
            { label: 'Monthly revenue', value: fmt(results.monthlyRevenue), color: 'text-[#10B981]' },
            { label: 'Monthly profit from leads', value: fmt(results.profit), color: results.profit > 0 ? 'text-[#10B981]' : 'text-[#EF4444]' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#1A2342]/80 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">{label}</p>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#1A2342]/60 rounded-xl p-5 border border-white/[0.06]">
          <p className="text-sm text-slate-400 leading-relaxed">
            At <strong className="text-white">{fmt(results.leaseCost)}/mo</strong> for exclusive {niche.name.toLowerCase()} leads in your city, closing <strong className="text-white">{closeRate}%</strong> of <strong className="text-white">~{results.monthlyLeads} leads</strong> at <strong className="text-white">{fmt(results.jobValue)} avg</strong> = <strong className="text-[#10B981]">{fmt(results.monthlyRevenue)} revenue/month</strong>.{' '}
            ROI: <strong className={results.roi > 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}>{results.roi.toFixed(0)}%</strong>. You break even at just <strong className="text-white">{results.breakEvenJobs} job{results.breakEvenJobs !== 1 ? 's' : ''}</strong>/month.
          </p>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-slate-600 mb-6">
          Estimates based on platform averages. Lead volume and lease pricing vary by specific city and market demand.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/markets/${niche.slug}`}
            className="inline-flex items-center justify-center min-h-[48px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-8 rounded-lg transition-colors"
          >
            Browse {niche.name} Markets
          </Link>
          <Link
            href="/tools/lead-cost-calculator"
            className="inline-flex items-center justify-center min-h-[48px] bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 rounded-lg transition-colors"
          >
            Lead Cost Calculator
          </Link>
        </div>
      </div>
    </div>
  );
}

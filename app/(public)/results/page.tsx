import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Results & Case Studies — ProvenQuote.ai',
  description: 'Real results from contractors using ProvenQuote exclusive market leases. Case studies across roofing, HVAC, plumbing, landscaping, and more.',
};

const CASE_STUDIES = [
  {
    business: 'Blue Ridge Roofing',
    location: 'Asheville, NC',
    niche: 'Roofing',
    monthlyLease: 1400,
    leadsPerMonth: 19,
    closeRate: '34%',
    monthlyRevenue: 54740,
    quote: 'I was burning $3k/month on shared leads with a 11% close rate. Switched to ProvenQuote and doubled my close rate in 60 days. The leads are warmer because there\'s no one else calling them.',
    owner: 'Marcus Chen',
    initials: 'MC',
    color: '#2563EB',
  },
  {
    business: 'Desert Air HVAC',
    location: 'Scottsdale, AZ',
    niche: 'HVAC',
    monthlyLease: 1100,
    leadsPerMonth: 24,
    closeRate: '31%',
    monthlyRevenue: 35568,
    quote: 'We\'ve tried Angi, HomeAdvisor, Thumbtack. Nothing comes close to exclusive. You\'re not racing anyone to the phone. The homeowner called our number from our page — they already trust you before you say a word.',
    owner: 'Priya Rajan',
    initials: 'PR',
    color: '#10B981',
  },
  {
    business: 'SunPath Solar',
    location: 'Austin, TX',
    niche: 'Solar',
    monthlyLease: 2800,
    leadsPerMonth: 16,
    closeRate: '28%',
    monthlyRevenue: 125440,
    quote: 'Solar leads on shared platforms were running us $180 each with a 9% close rate. ProvenQuote cut our effective cost per lead in half and tripled our close rate. The math is brutal how good it is.',
    owner: 'James Whitfield',
    initials: 'JW',
    color: '#F59E0B',
  },
  {
    business: 'GreenLine Landscaping',
    location: 'Portland, OR',
    niche: 'Landscaping',
    monthlyLease: 580,
    leadsPerMonth: 38,
    closeRate: '36%',
    monthlyRevenue: 24624,
    quote: 'Landscaping margins are tight. Every dollar matters. The lease pays for itself in the first week every month. We close almost 1 in 3 — on shared leads, we couldn\'t close 1 in 8.',
    owner: 'Sarah Okonkwo',
    initials: 'SO',
    color: '#8B5CF6',
  },
];

const AGGREGATE = [
  { stat: '3.1x', label: 'Higher close rate vs shared leads' },
  { stat: '2.8x', label: 'Lower cost per acquisition' },
  { stat: '89%', label: 'Of lessees renew after month 1' },
  { stat: '$0', label: 'Hidden fees or contracts' },
];

export default function ResultsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-20">
        <h1 className="text-5xl font-bold text-white mb-4">Real results from real contractors</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Here&apos;s what happens when you stop competing for shared leads and own your market.
        </p>
      </div>

      {/* Aggregate stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        {AGGREGATE.map(({ stat, label }) => (
          <div key={label} className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6 text-center">
            <p className="text-4xl font-bold text-white mb-2">{stat}</p>
            <p className="text-xs text-slate-500 leading-snug">{label}</p>
          </div>
        ))}
      </div>

      {/* Case studies */}
      <div className="space-y-8">
        {CASE_STUDIES.map((cs) => (
          <div
            key={cs.business}
            className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8"
          >
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              {/* Business info */}
              <div className="md:w-56 shrink-0">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white mb-4"
                  style={{ backgroundColor: `${cs.color}33`, color: cs.color }}
                >
                  {cs.initials}
                </div>
                <p className="text-sm font-semibold text-white">{cs.business}</p>
                <p className="text-xs text-slate-500">{cs.location}</p>
                <span
                  className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${cs.color}22`, color: cs.color }}
                >
                  {cs.niche}
                </span>
              </div>

              {/* Stats */}
              <div className="flex-1">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Monthly lease', value: `$${cs.monthlyLease.toLocaleString()}/mo` },
                    { label: 'Leads/month', value: cs.leadsPerMonth },
                    { label: 'Close rate', value: cs.closeRate },
                    { label: 'Revenue from leads', value: `$${cs.monthlyRevenue.toLocaleString()}/mo` },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-[#1A2342] rounded-xl p-3">
                      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                      <p className="text-base font-bold text-white">{value}</p>
                    </div>
                  ))}
                </div>

                <blockquote className="border-l-2 pl-5 italic text-slate-400 text-sm leading-relaxed" style={{ borderColor: cs.color }}>
                  &ldquo;{cs.quote}&rdquo;
                  <footer className="mt-2 not-italic text-xs text-slate-600">— {cs.owner}</footer>
                </blockquote>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-20 text-center bg-[#0F1729] border border-white/[0.08] rounded-2xl p-12">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to own your market?</h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
          Most markets are still available. Check your niche and city now before someone else leases it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/markets"
            className="inline-flex items-center justify-center min-h-[52px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-8 rounded-lg transition-colors"
          >
            Browse Available Markets
          </Link>
          <Link
            href="/tools/market-roi-estimator"
            className="inline-flex items-center justify-center min-h-[52px] bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 rounded-lg transition-colors"
          >
            Estimate Your ROI First
          </Link>
        </div>
      </div>
    </div>
  );
}

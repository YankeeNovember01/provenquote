import { NICHES } from '@/lib/niches';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Transparent pricing for lead purchases and market leases across all 15 niches. Lease prices scale with city traffic and lead volume.',
};

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white mb-4">Simple, transparent pricing</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          No setup fees. No contracts. No surprises.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Individual Lead Prices */}
        <div>
          <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="bg-[#1A2342] px-6 py-5 border-b border-white/[0.08]">
              <h2 className="text-lg font-semibold text-white">Individual Lead Prices</h2>
              <p className="text-xs text-slate-500 mt-1">
                Shared with up to 3 buyers. Price varies by city size and demand.
              </p>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Niche</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Price range</th>
                </tr>
              </thead>
              <tbody>
                {NICHES.map((n, i) => (
                  <tr
                    key={n.slug}
                    className={`hover:bg-white/5 transition-colors ${i < NICHES.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
                  >
                    <td className="px-6 py-3.5 text-sm text-slate-300">{n.name}</td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-white text-right">
                      \${n.leadPriceRange.min}&ndash;\${n.leadPriceRange.max}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lease Prices */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="bg-[#1A2342] px-6 py-5 border-b border-white/[0.08]">
              <h2 className="text-lg font-semibold text-white">Monthly Lease Prices</h2>
              <p className="text-xs text-slate-500 mt-1">
                Exclusive — every lead from that city goes to you. Cancel anytime.
              </p>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Niche</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Starting from</th>
                </tr>
              </thead>
              <tbody>
                {NICHES.map((n, i) => (
                  <tr
                    key={n.slug}
                    className={`hover:bg-white/5 transition-colors ${i < NICHES.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
                  >
                    <td className="px-6 py-3.5 text-sm text-slate-300">{n.name}</td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-white text-right">
                      \${n.leasePriceFrom.toLocaleString()}/mo
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Dynamic pricing explanation */}
          <div className="bg-[#0F1729] border border-[#2563EB]/20 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-3">How lease pricing works</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Lease prices scale with the city&apos;s monthly traffic and lead volume. A high-traffic market in a major metro generates more leads and commands a higher monthly rate. A smaller city starts at the floor price.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              When you browse a specific market, you see the exact monthly rate for that city — calculated from real traffic data. The prices in this table are the starting floor for each niche.
            </p>
            <a
              href="/markets"
              className="inline-flex items-center mt-4 text-sm font-semibold text-[#2563EB] hover:text-blue-400 transition-colors"
            >
              Browse markets to see live pricing &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 grid md:grid-cols-3 gap-6">
        {[
          {
            q: 'Are there setup fees?',
            a: 'None. Your first charge is your first monthly lease payment or lead purchase.',
          },
          {
            q: 'Why does the lease price change by city?',
            a: "A page ranking in Dallas drives 10x the traffic of a small suburb. Your lease price reflects what that market actually produces — you pay for output, not just a slot.",
          },
          {
            q: 'What payment methods are accepted?',
            a: 'All major credit cards via Stripe. ACH bank transfer available for annual prepayments.',
          },
        ].map(({ q, a }) => (
          <div key={q} className="bg-[#0F1729] border border-white/[0.08] rounded-xl p-6">
            <h3 className="font-semibold text-white mb-2 text-sm">{q}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

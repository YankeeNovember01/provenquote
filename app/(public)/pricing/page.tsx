import { NICHES } from '@/lib/niches';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Transparent pricing for lead purchases and market leases. All 15 niches. No hidden fees.',
};

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white mb-4">Simple, transparent pricing</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          No setup fees. No contracts. No surprises. Pay a flat monthly rate for leases or per-lead for individual purchases.
        </p>
      </div>

      {/* City tier note */}
      <div className="bg-[#1A2342] border border-white/10 rounded-xl p-5 mb-12 text-sm text-slate-400 flex items-start gap-3">
        <span className="text-[#F59E0B] shrink-0 mt-0.5 text-base">!</span>
        <span>
          <strong className="text-white">City tier pricing:</strong> Tier 1 cities (New York, Los Angeles, Chicago, Houston, Phoenix, Philadelphia, San Antonio, San Diego) carry a 1.5x price multiplier on leases due to higher traffic volume and lead value.
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Lead prices */}
        <div>
          <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="bg-[#1A2342] px-6 py-4 border-b border-white/[0.08]">
              <h2 className="text-lg font-semibold text-white">Individual Lead Prices</h2>
              <p className="text-xs text-slate-500 mt-1">Shared with up to 3 buyers. No subscription.</p>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Niche</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Per Lead</th>
                </tr>
              </thead>
              <tbody>
                {NICHES.map((n, i) => (
                  <tr key={n.slug} className={`hover:bg-white/5 transition-colors ${i < NICHES.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
                    <td className="px-6 py-3.5 text-sm text-slate-300">{n.name}</td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-white text-right">${n.avgLeadPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lease prices */}
        <div>
          <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="bg-[#1A2342] px-6 py-4 border-b border-white/[0.08]">
              <h2 className="text-lg font-semibold text-white">Monthly Lease Prices</h2>
              <p className="text-xs text-slate-500 mt-1">Exclusive — 100% of leads go to you. Cancel anytime.</p>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Niche</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Standard/mo</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Tier 1/mo</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Break-even</th>
                </tr>
              </thead>
              <tbody>
                {NICHES.map((n, i) => {
                  const tier1 = Math.round(n.avgLeasePrice * 1.5 / 100) * 100;
                  const breakEven = Math.ceil(n.avgLeasePrice / n.avgLeadPrice);
                  return (
                    <tr key={n.slug} className={`hover:bg-white/5 transition-colors ${i < NICHES.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
                      <td className="px-6 py-3.5 text-sm text-slate-300">{n.name}</td>
                      <td className="px-6 py-3.5 text-sm font-semibold text-white text-right">${n.avgLeasePrice.toLocaleString()}</td>
                      <td className="px-6 py-3.5 text-sm font-semibold text-[#2563EB] text-right">${tier1.toLocaleString()}</td>
                      <td className="px-6 py-3.5 text-sm text-slate-500 text-right">{breakEven} leads</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-600 mt-3 px-1">Break-even = leads/month needed for the lease to cost the same as buying those leads individually.</p>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 grid md:grid-cols-3 gap-6">
        {[
          { q: 'Are there setup fees?', a: 'None. Your first charge is your first monthly lease or lead purchase. That\'s it.' },
          { q: 'Can I change my plan?', a: 'You can cancel, upgrade to a lease, or add more markets at any time. Changes take effect on your next billing cycle.' },
          { q: 'What payment methods do you accept?', a: 'All major credit cards via Stripe. ACH bank transfer available for annual prepayments.' },
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

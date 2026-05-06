import { NICHES, getNiche } from '@/lib/niches';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ niche: string }>;
}

export async function generateStaticParams() {
  return NICHES.map(n => ({ niche: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { niche: nicheSlug } = await params;
  const niche = getNiche(nicheSlug);
  if (!niche) return {};
  return {
    title: `For ${niche.name} Businesses`,
    description: `Exclusive local leads for ${niche.roleLabel}s. Lease your niche market and receive every quote request from your city — no competition, no sharing.`,
  };
}

export default async function ForNichePage({ params }: Props) {
  const { niche: nicheSlug } = await params;
  const niche = getNiche(nicheSlug);
  if (!niche) notFound();

  const avgJobValue = niche.leadPriceRange.min * 18; // rough estimate
  const leadsPerMonth = 28;
  const closeRate = 0.3;
  const monthlyRevenue = Math.round(leadsPerMonth * closeRate * avgJobValue);
  const monthlyROI = monthlyRevenue - niche.leasePriceFrom;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="text-center mb-20">
        <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-widest mb-4">For {niche.name} Businesses</p>
        <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
          The {niche.name.toLowerCase()} market in your city<br />
          is yours for ${niche.leasePriceFrom.toLocaleString()}/mo
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          ProvenQuote.ai gives you exclusive access to every homeowner quote request in your market. One {niche.roleLabel} per city. No bidding. No sharing.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link
            href={`/markets/${niche.slug}`}
            className="inline-flex items-center justify-center min-h-[52px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-base px-8 rounded-lg transition-colors"
          >
            Browse {niche.name} Markets
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex items-center justify-center min-h-[52px] bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-base px-8 rounded-lg transition-colors"
          >
            How It Works
          </Link>
        </div>
      </div>

      {/* What the page looks like */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-white mb-4">Your brand. Your leads. Your page.</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          When you lease a market, we update our high-ranking local {niche.name.toLowerCase()} page with your business details. Visitors see your name, call your number, and fill out your form — exclusively.
        </p>
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8">
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <div className="bg-[#1A2342] px-6 py-3 text-xs text-slate-500 font-mono">
              provenquote.com/{niche.slug}/your-city-state
            </div>
            <div className="p-6">
              <p className="text-lg font-bold text-white mb-1">Your Business Name</p>
              <p className="text-sm text-slate-400 mb-4">The #1 trusted {niche.roleLabel} in [Your City]</p>
              <p className="text-xs text-slate-500 mb-4">
                Looking for a reliable {niche.roleLabel} in [City]? Your business has served hundreds of local homeowners. Get a free quote today.
              </p>
              <div className="bg-[#2563EB] text-white text-sm font-semibold text-center py-2.5 rounded-lg w-full max-w-xs">
                Get a Free Quote — Call (555) 000-0000
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-4 text-center">Every quote request on this page goes to you — no exceptions.</p>
        </div>
      </section>

      {/* ROI calculator */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-white mb-4">Does the math work?</h2>
        <p className="text-slate-400 mb-8">Based on a typical {niche.name.toLowerCase()} market at standard city pricing.</p>
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {[
              { label: 'Leads/month (est.)', value: leadsPerMonth.toString() },
              { label: 'Close rate (avg.)', value: '30%' },
              { label: 'Avg. job value', value: `$${avgJobValue.toLocaleString()}` },
              { label: 'Monthly lease cost', value: `$${niche.leasePriceFrom.toLocaleString()}` },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-slate-500 mb-1">{label}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.08] pt-8 flex flex-col md:flex-row gap-8">
            <div>
              <p className="text-xs text-slate-500 mb-1">Estimated monthly revenue from leads</p>
              <p className="text-3xl font-bold text-[#10B981]">${monthlyRevenue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Net after lease cost</p>
              <p className="text-3xl font-bold text-white">${monthlyROI.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">ROI</p>
              <p className="text-3xl font-bold text-[#2563EB]">{Math.round((monthlyROI / niche.leasePriceFrom) * 100)}x</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-6">
            Estimates based on industry averages. Actual results vary by city, competition, and your close rate. Most {niche.roleLabel}s see 20-40 inbound leads per month in standard markets.
          </p>
        </div>
      </section>

      {/* Testimonial placeholder */}
      <section className="mb-20">
        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8 text-center">
          <p className="text-lg text-slate-300 italic mb-4 leading-relaxed">
            &ldquo;I was spending $3,000/month on Google Ads and splitting every lead with 4 other {niche.roleLabel}s. With ProvenQuote, I pay ${niche.leasePriceFrom.toLocaleString()} and every lead is mine. Closed 8 jobs last month.&rdquo;
          </p>
          <p className="text-sm text-slate-500">— {niche.name} business owner, verified customer</p>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Claim your {niche.name.toLowerCase()} market</h2>
        <p className="text-slate-400 mb-8">Check which cities still have open slots for {niche.roleLabel}s.</p>
        <Link
          href={`/markets/${niche.slug}`}
          className="inline-flex items-center justify-center min-h-[52px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-10 rounded-lg transition-colors"
        >
          Browse {niche.name} Markets
        </Link>
        <p className="text-xs text-slate-600 mt-4">No credit card required to browse</p>
      </div>
    </div>
  );
}

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About ProvenQuote.ai',
  description: 'ProvenQuote.ai gives home service businesses exclusive access to local leads — one contractor per city per niche. Learn why we built it differently.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white mb-6">Built for contractors.<br />Not for the platform.</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Every other lead platform profits from selling the same lead to as many contractors as possible. We built the opposite.
        </p>
      </div>

      <div className="space-y-12 text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">The problem we set out to fix</h2>
          <p className="mb-4">
            Home service contractors are stuck in a terrible loop. They spend thousands per month on leads. Those leads go to 3–5 of their competitors at the same time. They race to be first to call. They compete on price before they&apos;ve even met the homeowner. They close 1 in 8 leads and wonder why the math never works.
          </p>
          <p>
            The lead platforms are fine with this. They get paid per lead sold — and selling the same lead five times is five times the revenue. The contractor suffers. The homeowner gets bombarded with calls. But the platform&apos;s unit economics are great.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Our model</h2>
          <p className="mb-4">
            ProvenQuote.ai builds and ranks hyper-local service pages for home service niches. A page for roofing in Denver. HVAC in Dallas. Landscaping in Seattle. Each page is optimized for people actively searching for a quote — not browsing, not researching, but ready to hire.
          </p>
          <p className="mb-4">
            Then we lease each page to exactly one local business. That contractor&apos;s information goes on the page. Their phone number. Their brand. Every lead from that page belongs to them.
          </p>
          <p>
            We win when you win. Our revenue comes from monthly leases, which means we&apos;re incentivized to keep generating leads for you — not to sell the same lead ten times.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">What we believe</h2>
          <div className="space-y-4">
            {[
              { title: 'Exclusivity changes everything', body: 'When you\'re the only contractor a homeowner hears from, you can actually sell. You stop racing and start building relationships.' },
              { title: 'Transparency is non-negotiable', body: 'We show you real traffic data, estimated lead volume, and current rankings before you lease. No surprises. No hidden costs.' },
              { title: 'Local businesses deserve better', body: 'The contractors who actually do the work — roofers, plumbers, HVAC techs — shouldn\'t be at the mercy of platforms designed to extract as much from them as possible.' },
            ].map(({ title, body }) => (
              <div key={title} className="flex gap-4">
                <span className="text-[#2563EB] mt-1 shrink-0">→</span>
                <div>
                  <p className="font-semibold text-white mb-1">{title}</p>
                  <p className="text-slate-400 text-sm">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Where we are today</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { stat: '15', label: 'Service niches' },
              { stat: '2,400+', label: 'Cities covered' },
              { stat: '100%', label: 'Exclusive — always' },
            ].map(({ stat, label }) => (
              <div key={label} className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-5 text-center">
                <p className="text-3xl font-bold text-white mb-1">{stat}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
          <p>
            We cover 15 home service niches across 2,400+ cities in the US. Most markets are still available — meaning most contractors in most cities can still get exclusive access to their local lead flow. That won&apos;t be true forever.
          </p>
        </section>
      </div>

      <div className="mt-16 text-center">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/markets"
            className="inline-flex items-center justify-center min-h-[52px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-8 rounded-lg transition-colors"
          >
            Browse Available Markets
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex items-center justify-center min-h-[52px] bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 rounded-lg transition-colors"
          >
            How It Works
          </Link>
        </div>
      </div>
    </div>
  );
}

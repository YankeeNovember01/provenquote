import Link from 'next/link';
import { NICHES } from '@/lib/niches';

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[800px] h-[600px] bg-[#2563EB]/[0.08] rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs font-medium text-slate-400 mb-8">
            <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full" />
            Exclusive leads — one business per city, per niche
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
            Own your market.<br />
            <span className="text-[#2563EB]">Not just a listing.</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            ProvenQuote leases one niche slot per city to a single local business. Every lead from that page goes to you — and only you. No bidding wars. No shared leads. Pure exclusivity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/markets"
              className="inline-flex items-center justify-center min-h-[52px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-base px-8 rounded-lg transition-colors"
            >
              Browse Available Markets
            </Link>
            <Link
              href="/leads"
              className="inline-flex items-center justify-center min-h-[52px] bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-base px-8 rounded-lg transition-colors"
            >
              Buy Individual Leads
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/[0.08] bg-[#0F1729]/60 py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { stat: '15', label: 'Service niches' },
            { stat: '2,400+', label: 'Cities covered' },
            { stat: '$0', label: 'Shared leads. Ever.' },
          ].map(({ stat, label }) => (
            <div key={label}>
              <p className="text-4xl font-bold text-white mb-1">{stat}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">How it works</h2>
          <p className="text-slate-400 text-center mb-16 max-w-xl mx-auto">The simplest lead model in the industry. No algorithms. No auctions. No surprises.</p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: '01', title: 'Find your market', body: 'Browse by niche and city. See live traffic estimates, monthly lead volume, and current page ranking data before you commit.' },
              { n: '02', title: 'Lease the slot', body: 'One flat monthly fee. You get exclusive ownership of every lead from that niche x city page for as long as your subscription is active.' },
              { n: '03', title: 'Receive leads', body: 'Every quote request goes directly to you in real time via SMS and email. No middleman. No sharing. No delay.' },
            ].map(({ n, title, body }) => (
              <div key={n} className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8">
                <p className="text-5xl font-bold text-white/10 mb-6 font-mono">{n}</p>
                <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Niche grid */}
      <section className="py-16 px-6 border-t border-white/[0.08]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2">All service niches</h2>
          <p className="text-slate-400 mb-10 text-sm">Every niche is available in thousands of US cities.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {NICHES.map(n => (
              <Link
                key={n.slug}
                href={`/markets/${n.slug}`}
                className="bg-[#0F1729] hover:bg-[#1A2342] border border-white/[0.08] rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:text-white transition-all"
              >
                {n.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lease vs Lead comparison */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-16">Two ways to buy</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Lease card */}
            <div className="bg-[#0F1729] border border-[#2563EB]/30 rounded-2xl p-8">
              <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-widest mb-4">Market Lease</p>
              <p className="text-2xl font-bold text-white mb-2">Full market ownership</p>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Lock in one niche in one city. Every lead from that page comes to you, every month, for as long as you lease. Cancel anytime.
              </p>
              <ul className="space-y-3 text-sm text-slate-300 mb-8">
                {[
                  'Exclusive — no other business on the page',
                  'Your branding, phone, and CTAs on the page',
                  'Real-time lead delivery via SMS + email',
                  'Flat monthly rate — predictable cost',
                  'Cancel anytime, no contracts',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-[#10B981] mt-0.5">+</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/markets"
                className="block w-full text-center bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Browse Markets
              </Link>
            </div>

            {/* Individual leads card */}
            <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Individual Leads</p>
              <p className="text-2xl font-bold text-white mb-2">Buy what you need</p>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Not ready to lease? Buy individual leads from unleased markets — verified contact info, service details, and city.
              </p>
              <ul className="space-y-3 text-sm text-slate-300 mb-8">
                {[
                  'No subscription required',
                  'Filter by niche, city, and service type',
                  'Shared with up to 3 buyers per lead',
                  'Pay per lead — no monthly commitment',
                  'Instant access on purchase',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-slate-500 mt-0.5">+</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/leads"
                className="block w-full text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Browse Available Leads
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto bg-[#0F1729] border border-white/[0.08] rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Your city. Your leads.</h2>
          <p className="text-slate-400 mb-8">Check if your niche is still available in your market.</p>
          <Link
            href="/markets"
            className="inline-flex items-center justify-center min-h-[52px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-10 rounded-lg transition-colors"
          >
            Check Market Availability
          </Link>
          <p className="text-xs text-slate-600 mt-4">No credit card required to browse</p>
        </div>
      </section>
    </>
  );
}

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'Learn how ProvenQuote.ai delivers exclusive local leads and market leases to home service businesses.',
};

export default function HowItWorksPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="text-center mb-24">
        <h1 className="text-5xl font-bold text-white mb-6">The only lead platform built for exclusivity</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Every other lead platform sells the same lead to 5 different contractors. We don&apos;t. Here&apos;s exactly how it works.
        </p>
      </div>

      {/* 5-step process */}
      <section className="mb-24">
        <h2 className="text-2xl font-bold text-white mb-12 text-center">The process, step by step</h2>
        <div className="space-y-6">
          {[
            {
              n: '01',
              title: 'We build and rank local service pages',
              body: 'ProvenQuote.ai creates highly optimized, city-specific service pages for every niche. A page for "Roofing in Austin, TX." Another for "HVAC in Phoenix, AZ." Each page is built for search intent — people actively looking for a quote. We rank these pages through SEO, Google Ads, and local citation work. Traffic comes in. Quote requests come in.',
            },
            {
              n: '02',
              title: 'You browse and claim a market',
              body: 'Browse our full market database. Filter by niche and city. Each listing shows estimated monthly traffic, projected lead volume, and the monthly lease price. When you find a market you want, you claim it. The slot is yours — exclusively — from the moment your subscription activates.',
            },
            {
              n: '03',
              title: 'Your brand goes on the page',
              body: 'We update the page with your business name, phone number, and contact details. Every call-to-action on that page points to you. Visitors see your brand, call your number, and fill out your quote form. You look like the authority in your market because you are.',
            },
            {
              n: '04',
              title: 'Leads arrive in real time',
              body: 'When a homeowner submits a quote request, you get an instant SMS and email with their full contact info — name, phone, email, address, service type, and their message. No lag. No batch delivery. No portal to check. The lead lands directly in your inbox and on your phone.',
            },
            {
              n: '05',
              title: 'You stay exclusive as long as you stay active',
              body: 'Your lease auto-renews monthly at a flat rate. There are no price hikes, no auctions, no competition. As long as you maintain your subscription, no other business can take your slot. Cancel anytime — your slot opens back up for the market.',
            },
          ].map(({ n, title, body }) => (
            <div key={n} className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8 flex gap-8">
              <p className="text-4xl font-bold text-white/10 font-mono shrink-0 w-16">{n}</p>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
                <p className="text-slate-400 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leased vs Unleased */}
      <section className="mb-24">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">What changes when a market is leased</h2>
        <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">The same page. Completely different experience for the contractor.</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">Unleased Market</p>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <span className="text-[#EF4444] mt-0.5">-</span>
                Generic ProvenQuote branding on the page
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#EF4444] mt-0.5">-</span>
                Leads sold individually to multiple buyers
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#EF4444] mt-0.5">-</span>
                Up to 3 contractors receive the same lead
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#EF4444] mt-0.5">-</span>
                No dedicated business on the page
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#EF4444] mt-0.5">-</span>
                You compete on price and speed
              </li>
            </ul>
          </div>
          <div className="bg-[#0F1729] border border-[#2563EB]/30 rounded-2xl p-8">
            <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-widest mb-6">Leased Market</p>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] mt-0.5">+</span>
                Your branding, logo, and phone number on the page
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] mt-0.5">+</span>
                Every lead goes exclusively to you
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] mt-0.5">+</span>
                Zero competition — you&apos;re the only option
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] mt-0.5">+</span>
                Flat monthly fee — no per-lead surprises
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] mt-0.5">+</span>
                You close more because you contact them first, every time
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-24">
        <h2 className="text-2xl font-bold text-white mb-12 text-center">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            {
              q: 'What happens if I cancel my lease?',
              a: 'Your slot returns to the open market immediately. Another business can claim it on their next billing cycle. There is no cancellation penalty — you simply stop being billed and the page reverts to generic branding.',
            },
            {
              q: 'How many leads can I expect per month?',
              a: 'Each market listing shows an estimated monthly lead range based on current traffic data. This varies by city size, niche competitiveness, and season. Our estimates are conservative — most lessees receive at or above projection.',
            },
            {
              q: 'Can I lease multiple markets?',
              a: 'Yes. Many businesses lease their primary city plus 2-3 surrounding cities. Each lease is billed separately and managed independently through your dashboard.',
            },
            {
              q: 'How quickly will my branding appear on the page?',
              a: 'Within 24 hours of your subscription activating, we update the page with your business details. Most updates go live within a few hours during business days.',
            },
            {
              q: 'Are leads verified?',
              a: 'Yes. Every lead goes through basic validation — valid email format, US phone number, and a minimum message length. We also deduplicate leads so you never receive the same contact twice.',
            },
            {
              q: 'What if a lead is a fake or spam?',
              a: 'Contact our support team within 48 hours. We review every dispute and issue credits for verifiably invalid leads — wrong number, spam bots, or test submissions.',
            },
            {
              q: 'How is the lease price determined?',
              a: 'Lease prices are set by niche and city tier. Tier 1 cities (NYC, LA, Chicago, Houston, Phoenix) carry a premium. Prices are listed on every market card before you commit.',
            },
            {
              q: 'Can I see the page before leasing?',
              a: 'Yes — every market links to the live public-facing page. You can see exactly what the homeowner sees, evaluate the quality, and make an informed decision before spending a dollar.',
            },
          ].map(({ q, a }) => (
            <div key={q} className="bg-[#0F1729] border border-white/[0.08] rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">{q}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-[#0F1729] border border-white/[0.08] rounded-3xl p-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to own your market?</h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">Browse available markets and see if your niche and city are still open. No credit card required to look.</p>
        <Link
          href="/markets"
          className="inline-flex items-center justify-center min-h-[52px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-10 rounded-lg transition-colors"
        >
          Browse Markets
        </Link>
      </div>
    </div>
  );
}

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How Exclusive Lead Generation Changed Our Roofing Business — ProvenQuote.ai Blog',
  description:
    'After years of sharing leads with 4 other roofers on HomeAdvisor, we made the switch to exclusive leads. Here\'s what happened to our close rate, revenue, and sanity.',
};

export default function BlogPost1() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <Link href="/blog" className="text-sm text-slate-500 hover:text-white transition-colors mb-8 inline-flex items-center gap-1">
        ← Back to Blog
      </Link>

      <div className="flex items-center gap-3 mb-6 mt-6">
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981]">Case Study</span>
        <span className="text-xs text-slate-500">May 14, 2026</span>
        <span className="text-xs text-slate-600">·</span>
        <span className="text-xs text-slate-500">6 min read</span>
      </div>

      <h1 className="text-4xl font-bold text-white mb-8 leading-tight">
        How Exclusive Lead Generation Changed Our Roofing Business
      </h1>

      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 leading-relaxed">
        <p>
          By late 2024, Marcus Chen was ready to quit. Not roofing — he loved the work. But the <em>lead game</em> was destroying his margins and his morale.
        </p>

        <p>
          His company, Blue Ridge Roofing, had been buying leads from HomeAdvisor for three years. The math should have worked: spend $3,000/month on leads, close enough jobs to make it worthwhile. But with 4 other roofing companies receiving the same leads, he was racing to the phone every time a notification fired.
        </p>

        <blockquote className="border-l-2 border-[#2563EB] pl-6 italic text-slate-400">
          "I was calling within 60 seconds. Still losing to someone faster. And then you find out they already got 3 quotes before you even said hello."
        </blockquote>

        <h2 className="text-2xl font-bold text-white mt-10">The Shared Lead Problem</h2>

        <p>
          The shared lead model isn't broken by accident — it's designed this way. Every lead sold to multiple contractors means multiple revenue streams for the platform. The contractor pays for the lead regardless of whether they close the job. The homeowner gets flooded with calls. Nobody wins except the platform.
        </p>

        <p>
          Marcus tracked his close rate for six months: <strong className="text-white">11%</strong>. On $3,000/month in lead spend, that meant he needed 27+ leads to close 3 jobs. Average job value: $8,500. Gross from leads: $25,500. Minus $3,000 lead cost. Minus labor. The math was thin.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10">Switching to Exclusive</h2>

        <p>
          In January 2025, Marcus leased the roofing market in Asheville, NC through ProvenQuote.ai for $1,400/month. The deal: every quote request from ProvenQuote's Asheville roofing page goes to him, and only him.
        </p>

        <p>
          The first month, he got 19 leads. His close rate shot to <strong className="text-white">34%</strong>. Why? Because instead of competing against 4 other roofers before a homeowner even answered the phone, Marcus was the only contractor calling. He could take his time, build rapport, and actually sell.
        </p>

        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6 my-8">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">6-Month Results</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Close rate', before: '11%', after: '34%' },
              { label: 'Cost per job', before: '$273', after: '$216' },
              { label: 'Monthly revenue from leads', before: '$25,500', after: '$68,000' },
            ].map(({ label, before, after }) => (
              <div key={label}>
                <p className="text-xs text-slate-500 mb-2">{label}</p>
                <p className="text-sm text-slate-500 line-through">{before}</p>
                <p className="text-lg font-bold text-[#10B981]">{after}</p>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mt-10">The Real Win: Time</h2>

        <p>
          Beyond the revenue numbers, Marcus got something back he didn't expect: time. No more waiting by the phone. No more speed-dialing strangers. He fields one call per lead, answers thoroughly, and moves on.
        </p>

        <p>
          "The stress is gone," he told us. "I run the business now instead of the business running me."
        </p>

        <h2 className="text-2xl font-bold text-white mt-10">Is It Right for Every Business?</h2>

        <p>
          Exclusive market leases aren't for everyone. You need consistent follow-up, a solid process for handling inbound calls, and capacity to fulfill the work. If you're a one-truck operation that's already fully booked, more leads won't help you.
        </p>

        <p>
          But if you have capacity, a good sales process, and you're tired of competing for the same scraped leads every other contractor in your city is getting — the math is pretty clear.
        </p>
      </div>

      <div className="mt-16 bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8 text-center">
        <h3 className="text-xl font-bold text-white mb-3">Check if your market is available</h3>
        <p className="text-slate-400 text-sm mb-6">One roofing business per city. Most markets are still open.</p>
        <Link
          href="/markets/roofing"
          className="inline-flex items-center justify-center min-h-[48px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-8 rounded-lg transition-colors"
        >
          Browse Roofing Markets
        </Link>
      </div>
    </div>
  );
}

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HomeAdvisor vs ProvenQuote: The Real Difference for Contractors — ProvenQuote.ai Blog',
  description:
    'We break down exactly how shared lead platforms work, why your close rate is suffering, and what switching to exclusive leads actually costs and returns.',
};

export default function BlogPost2() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <Link href="/blog" className="text-sm text-slate-500 hover:text-white transition-colors mb-8 inline-flex items-center gap-1">
        ← Back to Blog
      </Link>

      <div className="flex items-center gap-3 mb-6 mt-6">
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#2563EB]/20 text-[#2563EB]">Comparison</span>
        <span className="text-xs text-slate-500">May 7, 2026</span>
        <span className="text-xs text-slate-600">·</span>
        <span className="text-xs text-slate-500">8 min read</span>
      </div>

      <h1 className="text-4xl font-bold text-white mb-8 leading-tight">
        HomeAdvisor vs ProvenQuote: The Real Difference for Contractors
      </h1>

      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 leading-relaxed">

        <p>
          Let's be honest about how HomeAdvisor, Angi, and Thumbtack work. Not the marketing version — the actual mechanics that determine whether your lead spend turns into revenue.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10">How shared lead platforms work</h2>

        <p>
          A homeowner searches "HVAC repair Denver" and lands on an Angi landing page. They fill out a form. That form submission triggers an alert to every HVAC company that has purchased leads in the Denver area. Immediately, 3–5 of them get the same notification.
        </p>

        <p>
          Speed is everything. The first company to call has the highest chance of booking the job. So every contractor is incentivized to drop what they're doing and dial — which means they're also bad at their jobs for 5 minutes while sprinting to the phone.
        </p>

        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6 my-8">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">The Shared Lead Math</p>
          <div className="space-y-3 text-sm">
            {[
              ['Leads purchased/month', '30'],
              ['Average lead cost (HVAC)', '$65'],
              ['Monthly lead spend', '$1,950'],
              ['Competitors receiving same lead', '3–5'],
              ['Industry avg close rate (shared)', '14%'],
              ['Jobs closed', '4'],
              ['Avg HVAC job value', '$3,800'],
              ['Gross revenue', '$15,200'],
              ['Lead spend ROI', '7.8x'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                <span className="text-slate-400">{label}</span>
                <span className="text-white font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <p>
          7.8x sounds decent until you factor in labor, overhead, and the reality that you're paying for 26 leads that went nowhere.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10">How ProvenQuote works differently</h2>

        <p>
          ProvenQuote builds and ranks city-specific service pages for each niche. "HVAC repair in Denver, CO." One page. One contractor leases it. Every lead from that page goes to them.
        </p>

        <p>
          There's no race to the phone. The homeowner has already submitted their information to your page — your branded page, with your phone number. They expect your call. They're not talking to anyone else.
        </p>

        <div className="bg-[#0F1729] border border-white/[0.08] rounded-2xl p-6 my-8">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">The Exclusive Lease Math</p>
          <div className="space-y-3 text-sm">
            {[
              ['Monthly lease cost (HVAC, mid-size city)', '$900'],
              ['Avg leads/month from page', '22'],
              ['Cost per lead', '$41'],
              ['Competitors receiving same lead', '0'],
              ['Typical close rate (exclusive)', '28–35%'],
              ['Jobs closed', '7'],
              ['Avg HVAC job value', '$3,800'],
              ['Gross revenue', '$26,600'],
              ['Lead spend ROI', '29.6x'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                <span className="text-slate-400">{label}</span>
                <span className="text-white font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mt-10">Where HomeAdvisor wins</h2>

        <p>
          To be fair: HomeAdvisor has a massive network effect. Their pages rank for thousands of keywords across every city. If you're new, trying to test a market, or need volume fast, shared leads give you access immediately with no commitment.
        </p>

        <p>
          They also let you set geographic filters, pause spend, and adjust budgets easily. For contractors with unpredictable capacity, that flexibility has real value.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10">Where ProvenQuote wins</h2>

        <p>
          If you have consistent capacity and a real sales process, exclusive leads will always outperform shared ones. The close rate difference alone (14% vs 30%+) means you're getting 2x the jobs from the same number of leads.
        </p>

        <p>
          The other advantage: you can actually <em>sell</em>. No rushing the call. No homeowner who's already been pitched by 3 other contractors. You can ask questions, understand the job, and give a thoughtful quote.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10">The bottom line</h2>

        <p>
          Shared leads are a race to the bottom. Whoever calls fastest, bids cheapest, and manages to differentiate in a 90-second conversation wins. If that's your strategy, shared platforms have the scale.
        </p>

        <p>
          If you want to build a real business — repeatable, profitable, low-stress — exclusive leads are the better model. They cost more per lead, but the economics over a full year are dramatically better.
        </p>

      </div>

      <div className="mt-16 bg-[#0F1729] border border-white/[0.08] rounded-2xl p-8 text-center">
        <h3 className="text-xl font-bold text-white mb-3">See the full comparison</h3>
        <p className="text-slate-400 text-sm mb-6">ProvenQuote vs HomeAdvisor, Angi, and Thumbtack side by side.</p>
        <Link
          href="/compare"
          className="inline-flex items-center justify-center min-h-[48px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-8 rounded-lg transition-colors"
        >
          View Full Comparison
        </Link>
      </div>
    </div>
  );
}
